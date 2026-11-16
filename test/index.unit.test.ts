import { describe, expect, it, vi } from 'vitest'
import getDuration, { getAudioDurationInSeconds } from '../src'

vi.mock('music-metadata', () => ({
  parseFile: vi.fn().mockResolvedValue({
    format: {
      duration: 42.0,
      trackInfo: [],
    },
  }),
  TrackType: { audio: 0x02 },
}))

const expectedAudioDurationThreshold = -1

describe.each`
  fn                           | description
  ${getDuration}               | ${'default export'}
  ${getAudioDurationInSeconds} | ${'named export'}
`('when using $description', ({ fn }) => {
  it('should return the duration from music-metadata', async () => {
    await expect(fn('fake file', 'ignored ffprobe path')).resolves.toBeCloseTo(
      42.0,
      expectedAudioDurationThreshold,
    )
  })

  it('should pass duration: true option to music-metadata', async () => {
    await fn('fake file', 'ignored ffprobe path')

    const mod =
      await vi.importMock<typeof import('music-metadata')>('music-metadata')
    expect(mod.parseFile).toHaveBeenCalledWith('fake file', { duration: true })
  })

  it('should reject when music-metadata finds no duration', async () => {
    const mod =
      await vi.importMock<typeof import('music-metadata')>('music-metadata')
    vi.mocked(mod.parseFile).mockResolvedValueOnce({
      format: { trackInfo: [] },
    } as never)

    await expect(fn('fake file')).rejects.toThrow('No duration found!')
  })
})
