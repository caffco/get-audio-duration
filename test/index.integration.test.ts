import { describe, expect, it } from 'vitest'

import { resolve as resolvePath } from 'path'

import getDuration, { getAudioDurationInSeconds } from '../src'

const expectedOGGAudioDuration = 33
const expectedFLACAudioDuration = 97
const expectedWAVAudioDuration = 33
const expectedWEBMAudioDuration = 31
const expectedAudioDurationThreshold = -1

const sampleOGGFilePath = resolvePath(__dirname, './Rayman_2_music_sample.ogg')
const sampleOGGWithSpacesFilePath = resolvePath(
  __dirname,
  './Rayman 2 music sample.ogg'
)
const sampleFLACFilePath = resolvePath(
  __dirname,
  './2L-125_stereo-44k-16b_04.flac'
)
const sampleWAVFilePath = resolvePath(__dirname, './file_example_WAV_1MG.wav')
const sampleWEBMFilePath = resolvePath(
  __dirname,
  './file_example_WEBM_480_900KB.webm'
)

describe.each`
  fn                           | description
  ${getDuration}               | ${'default export'}
  ${getAudioDurationInSeconds} | ${'named export'}
`('when using $description', ({ fn }) => {
  it.each`
    input                          | expectedDuration             | description
    ${sampleFLACFilePath}          | ${expectedFLACAudioDuration} | ${'flac file'}
    ${sampleWAVFilePath}           | ${expectedWAVAudioDuration}  | ${'wav file'}
    ${sampleWEBMFilePath}          | ${expectedWEBMAudioDuration} | ${'webm file'}
    ${sampleOGGFilePath}           | ${expectedOGGAudioDuration}  | ${'ogg file'}
    ${sampleOGGWithSpacesFilePath} | ${expectedOGGAudioDuration}  | ${'file with spaces in its name'}
  `(
    'should return proper duration for $description',
    async ({ input, expectedDuration }) => {
      await expect(fn(input)).resolves.toBeCloseTo(
        expectedDuration,
        expectedAudioDurationThreshold
      )
    }
  )

  it('should throw an error if not an audio stream', async () => {
    const input = resolvePath(__dirname, __filename)
    await expect(fn(input)).rejects.toThrowError()
  })
})
