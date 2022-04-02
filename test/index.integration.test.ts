import { describe, it, expect, jest } from '@jest/globals'

import * as execa from 'execa'

import getDuration from '../src'

jest.mock('execa', () =>
  jest.fn().mockResolvedValue({
    stdout: 'duration="42.0"',
  } as never)
)
jest.mock('is-stream', () => jest.fn().mockReturnValue(false))

const expectedAudioDurationThreshold = -1

describe('get-audio-duration', () => {
  describe('when using a file path', () => {
    it('Should use overriden ffprobe when provided', async () => {
      const durationPromise = getDuration(
        'fake file',
        'the overriden path to ffprobe'
      )

      expect(execa).toHaveBeenCalledWith(
        'the overriden path to ffprobe',
        expect.anything()
      )

      await expect(durationPromise).resolves.toBeCloseTo(
        42.0,
        expectedAudioDurationThreshold
      )
    })
  })

  describe('when input is invalid', () => {
    it('Should throw an error', async () => {
      await expect(getDuration(42 as unknown as string)).rejects.toThrowError(
        'Given input was neither a string nor a Stream'
      )
    })
  })
})
