# get-audio-duration

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
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
[travis-image]: https://img.shields.io/travis/caffco/get-audio-duration.svg
[travis-url]: https://travis-ci.org/caffco/get-audio-duration
[codecov-image]: https://codecov.io/gh/caffco/get-audio-duration/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/caffco/get-audio-duration
[david-image]: http://img.shields.io/david/caffco/get-audio-duration.svg
[david-url]: https://david-dm.org/caffco/get-audio-duration
[license-image]: http://img.shields.io/npm/l/get-audio-duration.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/get-audio-duration.svg
[downloads-url]: https://npmjs.org/package/get-audio-duration
