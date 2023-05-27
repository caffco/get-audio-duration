import * as ffprobe from '@ffprobe-installer/ffprobe'

import execa from 'execa'

const getFFprobeWrappedExecution = (
  input: string,
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

  return execa(overridenPath, [...params, input])
}

/**
 * Returns a promise that will be resolved with the duration of given audio in
 * seconds.
 *
 * @param absolutePathToFile Absolute path to file to be used as input for
 * `ffprobe`.
 * @param [ffprobePath] Optional. Path to `ffprobe` binary. Do not provide any
 * value for this parameter unless you need to override the path to `ffprobe`.
 * Defaults to the path provided by `@ffprobe-installer/ffprobe`, which works in
 * most environments.
 *
 * @return Promise that will be resolved with given audio duration in
 * seconds.
 */
const getAudioDurationInSeconds = async (
  absolutePathToFile: string,
  ffprobePath?: string
): Promise<number> => {
  const { stdout } = await getFFprobeWrappedExecution(
    absolutePathToFile,
    ffprobePath
  )
  const matched = stdout.match(/duration="?(\d*\.\d*)"?/)
  if (matched && matched[1]) return parseFloat(matched[1])
  throw new Error('No duration found!')
}

export default getAudioDurationInSeconds
export { getAudioDurationInSeconds }
