import { openAsBlob } from 'node:fs'
import { parseBlob } from 'music-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import getDuration, { getAudioDurationInSeconds } from '../src'

const fileBlob = new Blob(['file contents'])

vi.mock('node:fs', () => ({
  openAsBlob: vi.fn(),
}))

vi.mock('music-metadata', () => ({
  parseBlob: vi.fn(),
  TrackType: { audio: 0x02 },
}))

const expectedAudioDurationThreshold = -1

beforeEach(() => {
  vi.mocked(openAsBlob).mockReset().mockResolvedValue(fileBlob)
  vi.mocked(parseBlob)
    .mockReset()
    .mockResolvedValue({
      format: { duration: 42.0, trackInfo: [] },
    } as never)
})

describe.each`
  fn                           | description
  ${getDuration}               | ${'default export'}
  ${getAudioDurationInSeconds} | ${'named export'}
`('when using $description', ({ fn }) => {
  it('should return the duration from music-metadata', async () => {
    await expect(fn('fake file')).resolves.toBeCloseTo(
      42.0,
      expectedAudioDurationThreshold,
    )
  })

  it('should open a path as a blob and pass duration: true to music-metadata', async () => {
    await fn('fake file')

    expect(openAsBlob).toHaveBeenCalledWith('fake file')
    expect(parseBlob).toHaveBeenCalledWith(fileBlob, { duration: true })
  })

  it('should pass a blob to music-metadata as is', async () => {
    const inputBlob = new Blob(['input contents'])

    await fn(inputBlob)

    expect(openAsBlob).not.toHaveBeenCalled()
    expect(parseBlob).toHaveBeenCalledWith(inputBlob, { duration: true })
  })

  it('should prefer the duration of the first audio track', async () => {
    vi.mocked(parseBlob).mockResolvedValueOnce({
      format: {
        duration: 42.0,
        trackInfo: [
          { type: 0x01, duration: 10.0 },
          { type: 0x02, duration: 7.0 },
        ],
      },
    } as never)

    await expect(fn('fake file')).resolves.toBe(7.0)
  })

  it('should reject when music-metadata finds no duration', async () => {
    vi.mocked(parseBlob).mockResolvedValueOnce({
      format: { trackInfo: [] },
    } as never)

    await expect(fn('fake file')).rejects.toThrow('No duration found!')
  })
})
