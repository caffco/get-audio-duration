// Keep the implementation ESM-only; CommonJS callers retain the same async API.
const getAudioDurationInSeconds: typeof import('./index.js').default = async (
  input,
) => {
  const { default: getDuration } = await import('./index.js')
  return getDuration(input)
}

export default getAudioDurationInSeconds
export { getAudioDurationInSeconds }
