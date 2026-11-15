const getAudioDurationInSeconds = async (
  absolutePathToFile: string,
  _ffprobePath?: string,
): Promise<number> => {
  const { parseFile, TrackType } = await import('music-metadata')

  const metadata = await parseFile(absolutePathToFile, { duration: true })

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
