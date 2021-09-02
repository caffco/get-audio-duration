const { getAudioDurationInSeconds } = require('get-audio-duration')

// From a local path...
getAudioDurationInSeconds('audio.flac').then((duration) => {
  console.log(duration)
})
