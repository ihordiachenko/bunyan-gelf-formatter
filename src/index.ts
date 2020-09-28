import stream from 'stream';
import Logger from 'bunyan';
import flatten from 'flat';

import { SYSLOG_LEVELS } from './constants';

const GELF_VERSION = '1.1';

const BUNYAN_TO_SYSYLOG_LEVELS = new Map([
  [Logger.FATAL, SYSLOG_LEVELS.CRITICAL],
  [Logger.ERROR, SYSLOG_LEVELS.ERROR],
  [Logger.WARN, SYSLOG_LEVELS.WARNING],
  [Logger.INFO, SYSLOG_LEVELS.INFO],
  [Logger.TRACE, SYSLOG_LEVELS.DEBUG],
  [Logger.DEBUG, SYSLOG_LEVELS.DEBUG],
]);

/**
 * Formats bunyan logs according to GELF payload spec.
 *
 * @link https://docs.graylog.org/en/3.2/pages/gelf.html?highlight=levels#gelf-payload-specification
 */
export class GelfFormatStream extends stream.Transform {
  private _raw: boolean;

  constructor(options: stream.TransformOptions, raw: boolean) {
    options.readableObjectMode = true;
    options.writableObjectMode = true;
    super(options);

    this._raw = raw;
  }

  _transform(
    chunk: any,
    _encoding: BufferEncoding,
    callback: stream.TransformCallback
  ): void {
    const gelfObject = this._bunyanToGelf(chunk);
    callback(null, this._raw ? gelfObject : JSON.stringify(gelfObject) + '\n');
  }

  _bunyanToGelf(bunyanMessage: any) {
    const gelfMessage: any = {
      version: GELF_VERSION,
      host: bunyanMessage.hostname,
      timestamp: Number(new Date(bunyanMessage.time)) / 1000,
      short_message: bunyanMessage.msg,
      level: this._convertLevel(bunyanMessage.level),
      facility: bunyanMessage.name,
      ...omit(flatten(bunyanMessage), [
        'hostname',
        'time',
        'msg',
        'name',
        'level',
        'v',
        'err',
      ]),
    };

    if (bunyanMessage.err && bunyanMessage.err.stack) {
      gelfMessage.full_message = bunyanMessage.err.stack;

      const match = bunyanMessage.err.stack.match(
        /\n\s+at .+ \((?<file>[^:]+):(?<line>\d+)/
      );
      const { file, line } = match.groups;

      if (file) {
        gelfMessage.file = file;
      }
      if (line) {
        gelfMessage.line = Number(line);
      }
    }

    return gelfMessage;
  }

  _convertLevel(level: number) {
    return BUNYAN_TO_SYSYLOG_LEVELS.get(level) ?? SYSLOG_LEVELS.WARNING;
  }
}

function omit(obj: any, keys: string[]): any {
  const omitted = new Set<string>(keys);

  return Object.keys(obj)
    .filter(key => !omitted.has(key))
    .reduce((acc: any, key: string): any => {
      acc[key] = obj[key];
      return acc;
    }, {});
}
