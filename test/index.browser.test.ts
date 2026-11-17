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

    it.each(samples)(
      'should return proper duration for a $fileName Uint8Array',
      async ({ fileName, expectedDuration }) => {
        const blob = await fetchSample(fileName)
        const bytes = new Uint8Array(await blob.arrayBuffer())
        const paddedBytes = new Uint8Array(bytes.length + 2)
        paddedBytes.set(bytes, 1)
        const subarray = paddedBytes.subarray(1, bytes.length + 1)

        await expect(fn(bytes)).resolves.toBeCloseTo(
          expectedDuration,
          expectedAudioDurationThreshold,
        )
        await expect(fn(subarray)).resolves.toBeCloseTo(
          expectedDuration,
          expectedAudioDurationThreshold,
        )
      },
    )

    it.each(['Blob', 'File', 'Uint8Array'] as const)(
      'should accept a %s created in another browser realm',
      async (inputType) => {
        const { fileName, expectedDuration } = samples[0]
        const blob = await fetchSample(fileName)
        const bytes = new Uint8Array(await blob.arrayBuffer())
        const iframe = document.createElement('iframe')
        document.body.append(iframe)

        try {
          const realm = iframe.contentWindow as unknown as Pick<
            typeof globalThis,
            'Blob' | 'File' | 'Uint8Array'
          >
          const input =
            inputType === 'Blob'
              ? new realm.Blob([bytes])
              : inputType === 'File'
                ? new realm.File([bytes], fileName)
                : new realm.Uint8Array(bytes)

          expect(input).not.toBeInstanceOf(globalThis[inputType])
          await expect(fn(input)).resolves.toBeCloseTo(
            expectedDuration,
            expectedAudioDurationThreshold,
          )
        } finally {
          iframe.remove()
        }
      },
    )

    it('should reject a Uint8Array that is not audio', async () => {
      await expect(fn(new Uint8Array([1, 2, 3]))).rejects.toThrow()
    })

    it('should reject a blob that is not audio', async () => {
      const blob = new Blob(['not audio'], { type: 'text/plain' })

      await expect(fn(blob)).rejects.toThrow()
    })
  })
})
