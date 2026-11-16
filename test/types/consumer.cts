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

// CommonJS import assignments also resolve the compatibility declarations.
import commonjs = require('get-audio-duration')

const requiredDuration: Promise<number> =
  commonjs.getAudioDurationInSeconds('audio.flac')
const requiredDefaultDuration: Promise<number> = commonjs.default(new Blob())

void requiredDuration
void requiredDefaultDuration

// @ts-expect-error The compatibility entry has the same input constraints.
commonjs.default(123)
