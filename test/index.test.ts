import { GelfFormatStream, SYSLOG_LEVELS, GELF_VERSION } from '../src';
import { ObjectWritableMock } from 'stream-mock';
import mockDate from 'mockdate';
import bunyan from 'bunyan';

const HOST = 'jest-host';
const LOGGER_NAME = 'test-logger';
const ERROR = new Error('The roof is on fire');
const LOG_MESSAGE = 'oh my!';
const NOW = Date.parse('2020-02-14');

describe('bunyan-gelf-formatter', () => {
  let stream: GelfFormatStream;
  let logger: bunyan;

  describe('object mode(raw)', () => {
    let gelfObject: any;

    beforeEach(() => {
      mockDate.set(NOW);

      stream = new GelfFormatStream({}, true);
      const outStream = new ObjectWritableMock();
      stream.pipe(outStream);

      logger = bunyan.createLogger({
        name: LOGGER_NAME,
        host: HOST,
        level: bunyan.DEBUG,
        streams: [{ type: 'raw', stream }],
      });

      logger.error(
        {
          err: ERROR,
          extraField: 'bar',
          nested: { nestedField: 'foo' },
        },
        LOG_MESSAGE
      );
      gelfObject = outStream.data[0];
    });

    it('should include GELF version', () => {
      expect(gelfObject).toHaveProperty('version', GELF_VERSION);
    });

    it('should convert log-level to syslog format', () => {
      expect(gelfObject).toHaveProperty('level', SYSLOG_LEVELS.ERROR);
    });

    it('should convert log message to short_message', () => {
      expect(gelfObject).toHaveProperty('short_message', LOG_MESSAGE);
    });

    it('should put error stack to full_message', () => {
      expect(gelfObject).toHaveProperty('full_message', ERROR.stack);
    });

    it('should convert JS Date to UNIX timestamp in seconds', () => {
      expect(gelfObject).toHaveProperty('timestamp', NOW / 1000);
    });

    it('should parse file and line from an error', () => {
      expect(gelfObject).toHaveProperty('file', __filename);
      expect(gelfObject).toHaveProperty('line', 8);
    });

    it('should copy extra fields', () => {
      expect(gelfObject).toHaveProperty('extraField', 'bar');
    });

    it('should flatten nested fields', () => {
      expect(gelfObject['nested.nestedField']).toEqual('foo');
    });
  });

  describe('normal mode', () => {
    let logLine: string;

    beforeEach(() => {
      mockDate.set(NOW);
      Object.defineProperty(process, 'pid', { get: () => 1 });

      stream = new GelfFormatStream({});
      const outStream = new ObjectWritableMock();
      stream.pipe(outStream);

      logger = bunyan.createLogger({
        name: LOGGER_NAME,
        host: HOST,
        level: bunyan.DEBUG,
        streams: [{ type: 'raw', stream }],
      });

      logger.info(LOG_MESSAGE);
      logLine = outStream.data[0];
    });

    it('should match stringified json', () => {
      expect(logLine).toMatchInlineSnapshot(`
        "{\\"version\\":\\"1.1\\",\\"host\\":\\"jest-host\\",\\"timestamp\\":1581638400,\\"short_message\\":\\"oh my!\\",\\"level\\":6,\\"facility\\":\\"test-logger\\",\\"pid\\":1}
        "
      `);
    });
  });
});
