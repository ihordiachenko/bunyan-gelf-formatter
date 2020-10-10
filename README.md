# bunyan-gelf-formatter

Converts [buynayn](https://github.com/trentm/node-bunyan) logs to [GELF](https://docs.graylog.org/en/3.2/pages/gelf.html)-compatible format.

Unlike other similar packages, `bunyan-gelf-formatter` doesn't send logs to Gaylog on its own, so it's ideal for usage with centralized log processors like Fluentd.

Raw bunyan logs cannot be processed by Fluentd GELF plugin due to incompatible `level` field. This package takes care of properly formatting the log level as well as other default GELF fields and flattening the JSON payloads.

## Installation

```sh
npm i -S bunyan-pretty-stream
```

## Usage

Add it as a [bunyan stream](https://github.com/trentm/node-bunyan#streams):

```js
const bunyan = require('bunyan')
const { GelfStream } = require('bunyan-gelf-formatter')


const logger = bunyan.createLogger({
    name: 'logger',
    streams: [new GelfStream()]
})
```
