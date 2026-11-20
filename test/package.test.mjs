import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { openAsBlob, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import esmDefault, {
  getAudioDurationInSeconds as esmNamed,
} from 'get-audio-duration'

const require = createRequire(import.meta.url)
const commonjs = require('get-audio-duration')

const samples = [
  ['Rayman_2_music_sample.ogg', 33.00267573696145],
  ['Rayman 2 music sample.ogg', 33.00267573696145],
  ['2L-125_stereo-44k-16b_04.flac', 97.76],
  ['file_example_WAV_1MG.wav', 33.529625],
  ['file_example_WEBM_480_900KB.webm', 30.543],
]

for (const {
  format,
  defaultExport,
  namedExport,
  entryPoint,
  fileName: entryFileName,
  dynamicImports,
} of [
  {
    format: 'ESM',
    defaultExport: esmDefault,
    namedExport: esmNamed,
    entryPoint: fileURLToPath(import.meta.resolve('get-audio-duration')),
    fileName: 'index.js',
    dynamicImports: ['music-metadata'],
  },
  {
    format: 'CommonJS',
    defaultExport: commonjs.default,
    namedExport: commonjs.getAudioDurationInSeconds,
    entryPoint: require.resolve('get-audio-duration'),
    fileName: 'index.cjs',
    dynamicImports: ['./index.js'],
  },
]) {
  describe(`published ${format} entry point`, () => {
    it('resolves to the correct build', () => {
      assert.equal(
        entryPoint,
        fileURLToPath(new URL(`../dist/${entryFileName}`, import.meta.url)),
      )
    })

    it('exposes matching default and named exports', () => {
      assert.equal(typeof namedExport, 'function')
      assert.equal(defaultExport, namedExport)
    })

    it('keeps native dynamic imports for ESM dependencies', () => {
      const source = readFileSync(entryPoint, 'utf8')
      for (const specifier of dynamicImports) {
        assert.ok(
          source.includes(`import('${specifier}')`) ||
            source.includes(`import("${specifier}")`),
          `Expected a native dynamic import of ${specifier}`,
        )
      }
      assert.doesNotMatch(source, /require\(['"]music-metadata['"]\)/)
    })

    for (const [exportName, getDuration] of [
      ['default', defaultExport],
      ['named', namedExport],
    ]) {
      for (const [fileName, expectedDuration] of samples) {
        const path = fileURLToPath(new URL(fileName, import.meta.url))
        for (const inputType of ['path', 'Blob', 'File']) {
          it(`parses ${fileName} as a ${inputType} via the ${exportName} export`, async () => {
            const blob =
              inputType === 'path' ? undefined : await openAsBlob(path)
            const input =
              inputType === 'path'
                ? path
                : inputType === 'Blob'
                  ? blob
                  : new File([blob], fileName)
            const duration = await getDuration(input)
            assert.ok(
              Math.abs(duration - expectedDuration) < 0.001,
              `Expected approximately ${expectedDuration}s, received ${duration}s`,
            )
          })
        }
      }

      it(`rejects non-audio input via the ${exportName} export`, async () => {
        await assert.rejects(getDuration(new Blob(['not audio'])))
      })
    }
  })
}

describe('ESM-first packaging', () => {
  it('declares ESM as the root package format and default entry', () => {
    const packageJson = require('get-audio-duration/package.json')
    assert.equal(packageJson.type, 'module')
    assert.equal(packageJson.types, 'dist/index.d.ts')
    assert.equal(packageJson.exports['.'].default, './dist/index.js')
  })

  it('provides module-specific declaration extensions', () => {
    const packageJson = require('get-audio-duration/package.json')
    assert.equal(packageJson.exports['.'].import.types, './dist/index.d.ts')
    assert.equal(packageJson.exports['.'].require.types, './dist/index.d.cts')
  })

  it('works when a fresh CommonJS consumer loads the package first', () => {
    const sample = fileURLToPath(
      new URL('2L-125_stereo-44k-16b_04.flac', import.meta.url),
    )
    const output = execFileSync(
      process.execPath,
      [
        '--input-type=commonjs',
        '--eval',
        `const assert = require('node:assert/strict');
const { getAudioDurationInSeconds, default: getDuration } = require('get-audio-duration');
assert.equal(getDuration, getAudioDurationInSeconds);
const result = getDuration(${JSON.stringify(sample)});
assert.ok(result instanceof Promise);
result.then(duration => {
  assert.ok(Math.abs(duration - 97.76) < 0.001);
  console.log(duration);
}).catch(error => { console.error(error); process.exitCode = 1; });`,
      ],
      {
        cwd: fileURLToPath(new URL('../', import.meta.url)),
        encoding: 'utf8',
      },
    )
    assert.equal(output.trim(), '97.76')
  })
})
