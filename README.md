# get-audio-duration

[![NPM version][npm-image]][npm-url]
![Build Status](https://github.com/caffco/get-audio-duration/workflows/test/badge.svg)
[![codecov](https://codecov.io/gh/caffco/get-audio-duration/graph/badge.svg?token=oOoNz6ghSM)](https://codecov.io/gh/caffco/get-audio-duration)
[![License][license-image]][license-url]
[![NPM bundle size (minified)][bundle-size-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

Get the duration of audio files with [music-metadata](https://github.com/Borewit/music-metadata).

# Supported platforms

Requires [Node.js ≥ 22](https://nodejs.org/en/about/previous-releases).
This package works in Node.js and in browser environments when bundled
with a module bundler such as Webpack or Rollup.

# Install

```bash
$ npm install --save get-audio-duration
```

# Usage

```js
import { getAudioDurationInSeconds } from 'get-audio-duration'

getAudioDurationInSeconds('audio.flac').then((duration) => {
  console.log(duration)
})

// The second `ffprobePath` argument is accepted for backwards compatibility
// but is ignored: music-metadata does not require an external ffprobe binary.

getAudioDurationInSeconds('audio.flac', '/path/to/ffprobe').then((duration) => {
  console.log(duration)
})
```

[music-metadata](https://github.com/Borewit/music-metadata) is a pure
JavaScript/TypeScript audio metadata parser with no external binary
dependency, replacing the previous `@ffprobe-installer/ffprobe` backend.

[npm-image]: https://img.shields.io/npm/v/get-audio-duration.svg
[npm-url]: https://npmjs.org/package/get-audio-duration
[bundle-size-image]: https://img.shields.io/bundlephobia/min/get-audio-duration.svg
[license-image]: http://img.shields.io/npm/l/get-audio-duration.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/get-audio-duration.svg
[downloads-url]: https://npmjs.org/package/get-audio-duration
