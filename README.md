# get-audio-duration

[![NPM version][npm-image]][npm-url]
[![Build status](https://github.com/caffco/get-audio-duration/actions/workflows/test.yml/badge.svg)](https://github.com/caffco/get-audio-duration/actions/workflows/test.yml)[![Maintainability](https://api.codeclimate.com/v1/badges/5033f5c3edd89b931e4a/maintainability)](https://codeclimate.com/github/caffco/get-audio-duration/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5033f5c3edd89b931e4a/test_coverage)](https://codeclimate.com/github/caffco/get-audio-duration/test_coverage)
[![Dependency Status][david-image]][david-url]
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
const { getAudioDurationInSeconds } = require('get-audio-duration');

// From a local path...
getAudioDurationInSeconds('audio.flac').then((duration) => {
  console.log(duration);
});

// From a readable stream...

const fs = require('fs');
const stream = fs.createReadStream('audio.flac');

getAudioDurationInSeconds(stream).then((duration) => {
  console.log(duration);
});
```

[npm-image]: https://img.shields.io/npm/v/get-audio-duration.svg
[npm-url]: https://npmjs.org/package/get-audio-duration
[bundle-size-image]: https://img.shields.io/bundlephobia/min/get-audio-duration.svg
[david-image]: http://img.shields.io/david/caffco/get-audio-duration.svg
[david-url]: https://david-dm.org/caffco/get-audio-duration
[license-image]: http://img.shields.io/npm/l/get-audio-duration.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/get-audio-duration.svg
[downloads-url]: https://npmjs.org/package/get-audio-duration
