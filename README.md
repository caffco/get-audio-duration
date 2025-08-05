# get-audio-duration

[![NPM version][npm-image]][npm-url]
![Build Status](https://github.com/caffco/get-audio-duration/workflows/test/badge.svg)
[![codecov](https://codecov.io/gh/caffco/get-audio-duration/graph/badge.svg?token=oOoNz6ghSM)](https://codecov.io/gh/caffco/get-audio-duration)
[![License][license-image]][license-url]
[![NPM bundle size (minified)][bundle-size-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

Get the duration of audio files with `ffprobe`.

# Supported platforms

Currently this package only supports Linux, Windows 7+, and MacOS 10.9+. **This package does not work in the browser**, iOS or Android.

# Install

```bash
$ npm install --save get-audio-duration
```

# Usage

```js
const { getAudioDurationInSeconds } = require('get-audio-duration')

getAudioDurationInSeconds('audio.flac').then((duration) => {
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
