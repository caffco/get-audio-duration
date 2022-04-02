import * as ffprobe from '@ffprobe-installer/ffprobe'

import * as execa from 'execa'
import * as isStream from 'is-stream'
import { Readable as ReadableStream } from 'stream'

const getFFprobeWrappedExecution = (
  input: string | ReadableStream,
  ffprobePath?: string
): execa.ExecaChildProcess => {
  const params = [
    '-v',
    'error',
    '-select_streams',
    'a:0',
    '-show_format',
    '-show_streams',
  ]

  const overridenPath = ffprobePath || ffprobe.path

  if (typeof input === 'string') {
    return execa(overridenPath, [...params, input])
  }

  if (isStream(input)) {
    return execa(overridenPath, [...params, '-i', 'pipe:0'], {
      reject: false,
      input,
    })
  }

  throw new Error('Given input was neither a string nor a Stream')
}

/**
 * Returns a promise that will be resolved with the duration of given audio in
 * seconds.
 *
 * @param input Stream or path to file to be used as
 * input for `ffprobe`.
 * @input [ffprobePath] Optional. Path to `ffprobe` binary. Do not provide any
 * value for this parameter unless you need to override the path to `ffprobe`.
 * Defaults to the path provided by `@ffprobe-installer/ffprobe`, which works in
 * most environments.
 *
 * @return Promise that will be resolved with given audio duration in
 * seconds.
 */
const getAudioDurationInSeconds = async (
  input: string | ReadableStream,
  ffprobePath?: string
): Promise<number> => {
  const { stdout } = await getFFprobeWrappedExecution(input, ffprobePath)
  const matched = stdout.match(/duration="?(\d*\.\d*)"?/)
  if (matched && matched[1]) return parseFloat(matched[1])
  throw new Error('No duration found!')
}

export default getAudioDurationInSeconds
export { getAudioDurationInSeconds }
