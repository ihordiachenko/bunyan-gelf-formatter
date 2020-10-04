import { GelfFormatStream } from '../src';

describe('blah', () => {
  let stream: GelfFormatStream;

  describe('_transform', () => {
    beforeEach(() => {
      stream = new GelfFormatStream({}, true);
    });

    it('should return an object in raw mode', () => {});

    it('should return stringified json in normal mode', () => {});
  });
});
