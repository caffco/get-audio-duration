import type { IAudioMetadata } from 'music-metadata'

// Intrinsic getters accept cross-realm values without trusting toStringTag.
const blobSize = Object.getOwnPropertyDescriptor(Blob.prototype, 'size')?.get
const typedArrayName = Object.getOwnPropertyDescriptor(
  Object.getPrototypeOf(Uint8Array.prototype),
  Symbol.toStringTag,
)?.get

const isBlob = (input: unknown): input is Blob => {
  try {
    return typeof blobSize?.call(input) === 'number'
  } catch {
    return false
  }
}

const isUint8Array = (input: unknown): input is Uint8Array =>
  typedArrayName?.call(input) === 'Uint8Array'

/**
 * Returns a promise that resolves with the duration of the given audio in
 * seconds.
 *
 * @param input Path to the file (Node.js only), or a `Blob`, `File` or
 * `Uint8Array` (Node.js and browsers).
 */
const getAudioDurationInSeconds = async (
  input: string | Blob | Uint8Array,
): Promise<number> => {
  let metadata: IAudioMetadata
  if (typeof input === 'string') {
    const { parseFile } = await import('music-metadata')
    metadata = await parseFile(input, { duration: true })
  } else if (isUint8Array(input)) {
    const { parseBuffer } = await import('music-metadata')
    metadata = await parseBuffer(input, undefined, { duration: true })
  } else if (isBlob(input)) {
    const { parseBlob } = await import('music-metadata')
    metadata = await parseBlob(input, { duration: true })
  } else {
    throw new TypeError('Expected a file path, Blob, File, or Uint8Array')
  }

  const { TrackType } = await import('music-metadata')

  // Match ffprobe's -select_streams a:0: prefer the first audio track's
  // duration, fall back to format.duration (e.g. video-only input).
  const audioTrack = metadata.format.trackInfo.find(
    (track): track is { duration?: number } => track.type === TrackType.audio,
  )
  const duration = audioTrack?.duration ?? metadata.format.duration

  if (duration === undefined) {
    throw new Error('No duration found!')
  }

  return duration
}

export default getAudioDurationInSeconds
export { getAudioDurationInSeconds }
