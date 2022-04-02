import { describe, it, expect } from '@jest/globals'

import * as fs from 'fs'
import { resolve as resolvePath } from 'path'

import getDuration, { getAudioDurationInSeconds } from '../src'

const expectedOGGAudioDuration = 33
const expectedFLACAudioDuration = 97
const expectedWAVAudioDuration = 33
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

describe('get-audio-duration', () => {
  it('Should export function under named export, too', () => {
    expect(getDuration).toEqual(getAudioDurationInSeconds)
  })

  const getReadableStreamAsInput = (pathToFile: string) =>
    fs.createReadStream(pathToFile)
  const getFilePathAsInput = (pathToFile: string) => pathToFile

  describe.each`
    description          | getInput                    | isOGGSupported
    ${'readable stream'} | ${getReadableStreamAsInput} | ${false}
    ${'file path'}       | ${getFilePathAsInput}       | ${true}
  `('when using a $description', ({ getInput, isOGGSupported }) => {
    it('Should return proper duration for flac files', async () => {
      const input = getInput(sampleFLACFilePath)
      const duration = await getDuration(input)
      expect(duration).toBeCloseTo(
        expectedFLACAudioDuration,
        expectedAudioDurationThreshold
      )
    })

    it.skip('Should return proper duration for wav files', async () => {
      const input = getInput(sampleWAVFilePath)
      const duration = await getDuration(input)
      expect(duration).toBeCloseTo(
        expectedWAVAudioDuration,
        expectedAudioDurationThreshold
      )
    })

    it('Should throw an error if not an audio stream', async () => {
      const input = getInput(resolvePath(__dirname, __filename))
      const durationPromise = getDuration(input)
      await expect(durationPromise).rejects.toThrowError()
    })

    if (isOGGSupported) {
      it('Should return proper duration for OGG files', async () => {
        const input = getInput(sampleOGGFilePath)
        const duration = await getDuration(input)
        expect(duration).toBeCloseTo(
          expectedOGGAudioDuration,
          expectedAudioDurationThreshold
        )
      })

      it('Should return proper duration if file contains spaces', async () => {
        const input = getInput(sampleOGGWithSpacesFilePath)
        const duration = await getDuration(input)
        expect(duration).toBeCloseTo(
          expectedOGGAudioDuration,
          expectedAudioDurationThreshold
        )
      })
    }
  })
})
