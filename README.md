# get-audio-duration

[![NPM version][npm-image]][npm-url]
![Build Status](https://github.com/caffco/get-audio-duration/workflows/test/badge.svg)
[![codecov](https://codecov.io/gh/caffco/get-audio-duration/graph/badge.svg?token=oOoNz6ghSM)](https://codecov.io/gh/caffco/get-audio-duration)
[![License][license-image]][license-url]
[![NPM bundle size (minified)][bundle-size-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

Get the duration of audio files with [music-metadata](https://github.com/Borewit/music-metadata).

# Supported platforms

- **Node.js:** Requires [Node.js ≥ 22](https://nodejs.org/en/about/previous-releases).
  Give a file path, a `Blob`, a `File` or a `Uint8Array` (including `Buffer`).
- **Browser:** Give a `Blob`, a `File` or a `Uint8Array`. A file path does not
  work in the browser. The tests use Vite and Chromium.

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

// In the browser, give a Blob or a File, for example from a file input.

const [file] = document.querySelector('input[type="file"]').files
getAudioDurationInSeconds(file).then((duration) => {
  console.log(duration)
})
```

You can also pass audio bytes directly, without converting them to a `Blob`:

```js
const response = await fetch('audio.flac')
const bytes = new Uint8Array(await response.arrayBuffer())
const duration = await getAudioDurationInSeconds(bytes)
console.log(duration)
```

Inputs created in another browser realm, such as a same-origin iframe, are also supported.

Unsupported input types reject with a `TypeError`.

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
