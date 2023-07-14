## 4.0.0

**BREAKING CHANGES:**

- Drop stream support. Download the file locally and pass the absolute path to
  `getAudioDurationInSeconds` instead.

## 3.1.1

Fixed:

- Fixed documentation for `ffprobePath` param.

## 3.1.0

Changed:

- Allow overriding `ffprobe` path by passing a second, optional, parameter.

## 3.0.1

Changed:

- Use `@ffprobe-installer/ffprobe` instead of `node-ffprobe-installer`.

Fixed:

- Fix Apple Silicon support.

## 3.0.0

**BREAKING CHANGES:**

- Dropped Node.js 13 support.

New:

- Added Apple silicon support.

Changed:

- Dependencies upgraded to their latest semver-compatible versions.

## 2.0.3

Changed:

- Dependencies upgraded to their latest semver-compatible versions.

## 2.0.2

Changed:

- Replaced ffprobe-static by @ffprobe-installer/ffprobe.

## 2.0.1

Changed:

- Upgrade Lodash from 4.17.11 to 4.17.13 to address security issues.

## 2.0.0

Breaking:

- Minimum Node version supported up to 10 from 8.

Changed:

- Version bump of dependencies.

## 1.0.2

New:

- Add `getVideoDurationInSeconds` named export to easy inter-op with CommonJS modules

## 1.0.1

Changed:

- Don't export raw source code
- Package ES6-compatible module

## 1.0.0

New:

- Rewritten in TypeScript
- No need to install ffprobe globally in the system

Changed:

- Upgraded dependencies to their latest version

## 0.0.1

:tada: First release
