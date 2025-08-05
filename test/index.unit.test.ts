import execa from 'execa'
import { describe, expect, it, vi } from 'vitest'
import getDuration, { getAudioDurationInSeconds } from '../src'

vi.mock('execa', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue({
    stdout: 'duration="42.0"',
  } as never),
}))

const expectedAudioDurationThreshold = -1

describe.each`
  fn                           | description
  ${getDuration}               | ${'default export'}
  ${getAudioDurationInSeconds} | ${'named export'}
`('when using $description', ({ fn }) => {
  it('should use overriden ffprobe when provided', async () => {
    const durationPromise = fn('fake file', 'the overriden path to ffprobe')

    expect(execa).toHaveBeenCalledWith(
      'the overriden path to ffprobe',
      expect.anything(),
    )

    await expect(durationPromise).resolves.toBeCloseTo(
      42.0,
      expectedAudioDurationThreshold,
    )
  })
})
