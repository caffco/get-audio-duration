import { readFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'
import { describe, expect, it } from 'vitest'

import getDuration, { getAudioDurationInSeconds } from '../src'

const expectedOGGAudioDuration = 33
const expectedFLACAudioDuration = 97
const expectedWAVAudioDuration = 33
const expectedWEBMAudioDuration = 31
const expectedAudioDurationThreshold = -1

const sampleOGGFilePath = resolvePath(__dirname, './Rayman_2_music_sample.ogg')
const sampleOGGWithSpacesFilePath = resolvePath(
  __dirname,
  './Rayman 2 music sample.ogg',
)
const sampleFLACFilePath = resolvePath(
  __dirname,
  './2L-125_stereo-44k-16b_04.flac',
)
const sampleWAVFilePath = resolvePath(__dirname, './file_example_WAV_1MG.wav')
const sampleWEBMFilePath = resolvePath(
  __dirname,
  './file_example_WEBM_480_900KB.webm',
)

const samples = [
  {
    input: sampleFLACFilePath,
    expectedDuration: expectedFLACAudioDuration,
    description: 'flac file',
  },
  {
    input: sampleWAVFilePath,
    expectedDuration: expectedWAVAudioDuration,
    description: 'wav file',
  },
  {
    input: sampleWEBMFilePath,
    expectedDuration: expectedWEBMAudioDuration,
    description: 'webm file',
  },
  {
    input: sampleOGGFilePath,
    expectedDuration: expectedOGGAudioDuration,
    description: 'ogg file',
  },
  {
    input: sampleOGGWithSpacesFilePath,
    expectedDuration: expectedOGGAudioDuration,
    description: 'file with spaces in its name',
  },
]

describe.each`
  fn                           | description
  ${getDuration}               | ${'default export'}
  ${getAudioDurationInSeconds} | ${'named export'}
`('when using $description', ({ fn }) => {
  describe.each(samples)('$description', ({ input, expectedDuration }) => {
    it('should return proper duration for a file path', async () => {
      await expect(fn(input)).resolves.toBeCloseTo(
        expectedDuration,
        expectedAudioDurationThreshold,
      )
    })

    it('should return proper duration for a Uint8Array and Buffer', async () => {
      const buffer = await readFile(input)
      const bytes = new Uint8Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      )

      await expect(fn(bytes)).resolves.toBeCloseTo(
        expectedDuration,
        expectedAudioDurationThreshold,
      )
      await expect(fn(buffer)).resolves.toBeCloseTo(
        expectedDuration,
        expectedAudioDurationThreshold,
      )
    })
  })

  it('should throw an error if not an audio stream', async () => {
    const input = resolvePath(__dirname, __filename)
    await expect(fn(input)).rejects.toThrowError()
  })
})
