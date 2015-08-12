
# get-audio-duration

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Get the duration of an audio with `ffprobe`.
Requires the `ffprobe` binary installed.

```js
var getDuration = require('get-audio-duration');

getDuration('audio.mp3').then(function (duration) {
  console.log(duration);
})
```

Based on [get-video-dimensions](https://github.com/mgmtio/get-video-dimensions).

[gitter-image]: https://badges.gitter.im/caffco/get-audio-duration.png
[gitter-url]: https://gitter.im/caffco/get-audio-duration
[npm-image]: https://img.shields.io/npm/v/get-audio-duration.svg?style=flat-square
[npm-url]: https://npmjs.org/package/get-audio-duration
[github-tag]: http://img.shields.io/github/tag/caffco/get-audio-duration.svg?style=flat-square
[github-url]: https://github.com/caffco/get-audio-duration/tags
[travis-image]: https://img.shields.io/travis/caffco/get-audio-duration.svg?style=flat-square
[travis-url]: https://travis-ci.org/caffco/get-audio-duration
[coveralls-image]: https://img.shields.io/coveralls/caffco/get-audio-duration.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/caffco/get-audio-duration
[david-image]: http://img.shields.io/david/caffco/get-audio-duration.svg?style=flat-square
[david-url]: https://david-dm.org/caffco/get-audio-duration
[license-image]: http://img.shields.io/npm/l/get-audio-duration.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/get-audio-duration.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/get-audio-duration
