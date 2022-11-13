# bunyan-gelf-formatter

[![npm](https://img.shields.io/npm/v/bunyan-gelf-formatter.svg)](https://www.npmjs.com/package/bunyan-gelf-formatter)

Converts [bunyan](https://github.com/trentm/node-bunyan) logs to [GELF](https://docs.graylog.org/docs/gelf)-compatible format.

Unlike other similar packages, `bunyan-gelf-formatter` doesn't send logs to Graylog on its own, so it's ideal for usage with centralized log processors like Fluentd.

Raw bunyan logs cannot be processed by Fluentd GELF plugin due to incompatible `level` field. This package takes care of properly formatting the log level as well as other default GELF fields and flattening the JSON payloads.

## Installation

```sh
npm i -S bunyan-gelf-formatter
```

## Usage

Add it as a [bunyan stream](https://github.com/trentm/node-bunyan#streams):

```js
const bunyan = require('bunyan')
const { GelfStream } = require('bunyan-gelf-formatter')

const gelfStream = new GelfStream({})
gelfStream.pipe(process.stdout)

const logger = bunyan.createLogger({
    name: 'logger',
    streams: [{ type: 'raw', stream: gelfStream }]
})
```
