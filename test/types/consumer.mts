import getDuration, { getAudioDurationInSeconds } from 'get-audio-duration'

const duration: Promise<number> = getDuration('audio.flac')
const blobDuration: Promise<number> = getAudioDurationInSeconds(new Blob())
const fileDuration: Promise<number> = getAudioDurationInSeconds(
  new File([], 'audio.flac'),
)

void duration
void blobDuration
void fileDuration

// @ts-expect-error Only file paths, Blobs and Files are supported.
getAudioDurationInSeconds(123)
