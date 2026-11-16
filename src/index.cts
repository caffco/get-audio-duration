// Keep the implementation ESM-only; CommonJS callers retain the same async API.
const getAudioDurationInSeconds = async (
  input: string | Blob | Uint8Array,
): Promise<number> => {
  const { default: getDuration } = await import('./index.js')
  return getDuration(input)
}

export default getAudioDurationInSeconds
export { getAudioDurationInSeconds }
