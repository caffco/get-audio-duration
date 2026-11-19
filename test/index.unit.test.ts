import { Buffer } from 'node:buffer'
import { parseBlob, parseBuffer, parseFile } from 'music-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import getDuration, { getAudioDurationInSeconds } from '../src'

vi.mock('music-metadata', () => ({
  parseBlob: vi.fn(),
  parseBuffer: vi.fn(),
  parseFile: vi.fn(),
  TrackType: { audio: 0x02 },
}))

const expectedAudioDurationThreshold = -1
const inputBlob = new Blob(['input contents'])
const inputFile = new File([inputBlob], 'audio.flac')
const inputs = [
  { input: 'fake file', description: 'path', parser: parseFile },
  { input: inputBlob, description: 'blob', parser: parseBlob },
  { input: inputFile, description: 'file', parser: parseBlob },
  {
    input: new Uint8Array([1, 2, 3]),
    description: 'Uint8Array',
    parser: parseBuffer,
  },
  {
    input: new Uint8Array([0, 1, 2, 3, 0]).subarray(1, 4),
    description: 'Uint8Array subarray',
    parser: parseBuffer,
  },
  {
    input: Buffer.from([1, 2, 3]),
    description: 'Buffer',
    parser: parseBuffer,
  },
]
const parsers = [parseFile, parseBlob, parseBuffer]
const unsupportedInputs = [
  { input: null, description: 'null' },
  { input: undefined, description: 'undefined' },
  { input: 42, description: 'number' },
  { input: {}, description: 'object' },
  { input: [1, 2, 3], description: 'array' },
  { input: new ArrayBuffer(3), description: 'ArrayBuffer' },
  { input: new DataView(new ArrayBuffer(3)), description: 'DataView' },
  { input: new Uint16Array([1, 2, 3]), description: 'Uint16Array' },
  {
    input: { [Symbol.toStringTag]: 'Blob', size: 3 },
    description: 'object spoofing a Blob tag',
  },
  {
    input: { [Symbol.toStringTag]: 'File', size: 3 },
    description: 'object spoofing a File tag',
  },
  {
    input: { [Symbol.toStringTag]: 'Uint8Array' },
    description: 'object spoofing a Uint8Array tag',
  },
  {
    input: Object.defineProperty(
      new Uint16Array([1, 2, 3]),
      Symbol.toStringTag,
      {
        value: 'Uint8Array',
      },
    ),
    description: 'Uint16Array spoofing a Uint8Array tag',
  },
]

beforeEach(() => {
  for (const parser of parsers) {
    vi.mocked(parser)
      .mockReset()
      .mockResolvedValue({
        format: { duration: 42.0, trackInfo: [] },
      } as never)
  }
})

describe.each`
  fn                           | description
  ${getDuration}               | ${'default export'}
  ${getAudioDurationInSeconds} | ${'named export'}
`('when using $description', ({ fn }) => {
  describe.each(inputs)('$description', ({ input, parser }) => {
    it('should return the duration from music-metadata', async () => {
      await expect(fn(input)).resolves.toBeCloseTo(
        42.0,
        expectedAudioDurationThreshold,
      )
    })

    it('should pass the input unchanged to the correct parser with duration: true', async () => {
      await fn(input)

      const args =
        input instanceof Uint8Array
          ? [input, undefined, { duration: true }]
          : [input, { duration: true }]
      expect(parser).toHaveBeenCalledExactlyOnceWith(...args)
      for (const otherParser of parsers) {
        if (otherParser !== parser) {
          expect(otherParser).not.toHaveBeenCalled()
        }
      }
    })

    it('should prefer the duration of the first audio track', async () => {
      vi.mocked(parser).mockResolvedValueOnce({
        format: {
          duration: 42.0,
          trackInfo: [
            { type: 0x01, duration: 10.0 },
            { type: 0x02, duration: 7.0 },
          ],
        },
      } as never)

      await expect(fn(input)).resolves.toBe(7.0)
    })

    it('should reject when music-metadata finds no duration', async () => {
      vi.mocked(parser).mockResolvedValueOnce({
        format: { trackInfo: [] },
      } as never)

      await expect(fn(input)).rejects.toThrow('No duration found!')
    })
  })

  it.each(unsupportedInputs)(
    'should reject an unsupported $description without calling a parser',
    async ({ input }) => {
      await expect(fn(input as never)).rejects.toThrow(TypeError)
      await expect(fn(input as never)).rejects.toThrow(
        'Expected a file path, Blob, File, or Uint8Array',
      )
      for (const parser of parsers) {
        expect(parser).not.toHaveBeenCalled()
      }
    },
  )
})
