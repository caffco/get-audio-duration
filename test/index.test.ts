import 'jest'

import * as fs from 'fs'
import { resolve as resolvePath } from 'path'

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

import getDuration, { getAudioDurationInSeconds } from '../src/index'

describe('get-audio-duration', function () {
  it('Should export function under named export, too', function () {
    expect(getDuration).toEqual(getAudioDurationInSeconds)
  })

  describe('When using a readable stream', function () {
    it('Should return proper duration for flac files', async function () {
      const inputFileReadStream = fs.createReadStream(sampleFLACFilePath)
      const duration = await getDuration(inputFileReadStream)
      expect(duration).toBeCloseTo(
        expectedFLACAudioDuration,
        expectedAudioDurationThreshold
      )
    })

    it.skip('Should return proper duration for wav files', async function () {
      const inputFileReadStream = fs.createReadStream(sampleWAVFilePath)
      const duration = await getDuration(inputFileReadStream)
      expect(duration).toBeCloseTo(
        expectedWAVAudioDuration,
        expectedAudioDurationThreshold
      )
    })

    it('Should throw an error if not an audio stream', async function () {
      const inputFileReadStream = fs.createReadStream(
        resolvePath(__dirname, __filename)
      )
      const durationPromise = getDuration(inputFileReadStream)
      await expect(durationPromise).rejects.toThrowError()
    })
  })

  describe('When using a file path', function () {
    it('Should return proper duration for OGG files', async function () {
      const duration = await getDuration(sampleOGGFilePath)
      expect(duration).toBeCloseTo(
        expectedOGGAudioDuration,
        expectedAudioDurationThreshold
      )
    })

    it('Should return proper duration for wav files', async function () {
      const duration = await getDuration(sampleWAVFilePath)
      expect(duration).toBeCloseTo(
        expectedWAVAudioDuration,
        expectedAudioDurationThreshold
      )
    })

    it('Should throw an error if not an audio file', async function () {
      const durationPromise = getDuration(resolvePath(__dirname, __filename))
      await expect(durationPromise).rejects.toThrowError()
    })

    it('Should return proper duration if file contains spaces', async function () {
      const duration = await getDuration(sampleOGGWithSpacesFilePath)
      expect(duration).toBeCloseTo(
        expectedOGGAudioDuration,
        expectedAudioDurationThreshold
      )
    })
  })
})
