const toBlob = async (input: string | Blob): Promise<Blob> => {
  if (typeof input !== 'string') {
    return input
  }

  const { openAsBlob } = await import('node:fs')
  return openAsBlob(input)
}

/**
 * Returns a promise that resolves with the duration of the given audio in
 * seconds.
 *
 * @param input Path to the file (Node.js only), or a `Blob` / `File` (Node.js
 * and browsers).
 */
const getAudioDurationInSeconds = async (
  input: string | Blob,
): Promise<number> => {
  const { parseBlob, TrackType } = await import('music-metadata')

  const metadata = await parseBlob(await toBlob(input), { duration: true })

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
