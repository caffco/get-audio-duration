# get-audio-duration

[![NPM version][npm-image]][npm-url]
![Build Status](https://github.com/caffco/get-audio-duration/workflows/test/badge.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/5033f5c3edd89b931e4a/maintainability)](https://codeclimate.com/github/caffco/get-audio-duration/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5033f5c3edd89b931e4a/test_coverage)](https://codeclimate.com/github/caffco/get-audio-duration/test_coverage)
[![License][license-image]][license-url]
[![NPM bundle size (minified)][bundle-size-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

Get the duration of audio files/streams with `ffprobe`.

# Install

```bash
$ npm install --save get-audio-duration
```

# Usage

```js
const { getAudioDurationInSeconds } = require('get-audio-duration')

// From a local path...
getAudioDurationInSeconds('audio.flac').then((duration) => {
  console.log(duration)
})

// From a readable stream...

const fs = require('fs')
const stream = fs.createReadStream('audio.flac')

getAudioDurationInSeconds(stream).then((duration) => {
  console.log(duration)
})

// If you need to customize the path to ffprobe...

getAudioDurationInSeconds('audio.flac', '/path/to/ffprobe').then((duration) => {
  console.log(duration)
})
```

[npm-image]: https://img.shields.io/npm/v/get-audio-duration.svg
[npm-url]: https://npmjs.org/package/get-audio-duration
[bundle-size-image]: https://img.shields.io/bundlephobia/min/get-audio-duration.svg
[license-image]: http://img.shields.io/npm/l/get-audio-duration.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/get-audio-duration.svg
[downloads-url]: https://npmjs.org/package/get-audio-duration
