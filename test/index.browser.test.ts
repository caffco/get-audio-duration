import { describe, expect, it } from 'vitest'
import getDuration, { getAudioDurationInSeconds } from '../src'

const expectedAudioDurationThreshold = -1

const samples = [
  { fileName: 'Rayman_2_music_sample.ogg', expectedDuration: 33 },
  { fileName: '2L-125_stereo-44k-16b_04.flac', expectedDuration: 97 },
  { fileName: 'file_example_WAV_1MG.wav', expectedDuration: 33 },
  { fileName: 'file_example_WEBM_480_900KB.webm', expectedDuration: 31 },
]

const fetchSample = async (fileName: string): Promise<Blob> => {
  const response = await fetch(`/test/${encodeURIComponent(fileName)}`)
  if (!response.ok) {
    throw new Error(`Cannot fetch ${fileName}: HTTP ${response.status}`)
  }
  return response.blob()
}

describe('in a browser', () => {
  it('should run in a real browser', () => {
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')
  })

  describe.each`
    fn                           | description
    ${getDuration}               | ${'default export'}
    ${getAudioDurationInSeconds} | ${'named export'}
  `('when using $description', ({ fn }) => {
    it.each(samples)(
      'should return proper duration for a $fileName blob',
      async ({ fileName, expectedDuration }) => {
        const blob = await fetchSample(fileName)

        await expect(fn(blob)).resolves.toBeCloseTo(
          expectedDuration,
          expectedAudioDurationThreshold,
        )
      },
    )

    it.each(samples)(
      'should return proper duration for a $fileName file',
      async ({ fileName, expectedDuration }) => {
        const blob = await fetchSample(fileName)
        const file = new File([blob], fileName, { type: blob.type })

        await expect(fn(file)).resolves.toBeCloseTo(
          expectedDuration,
          expectedAudioDurationThreshold,
        )
      },
    )

    it('should reject a blob that is not audio', async () => {
      const blob = new Blob(['not audio'], { type: 'text/plain' })

      await expect(fn(blob)).rejects.toThrow()
    })
  })
})
