import 'mocha';

import * as chaiAsPromised from 'chai-as-promised';
import { expect, use as chaiUse } from 'chai';
chaiUse(chaiAsPromised);

import * as fs from 'fs';
import { resolve as resolvePath } from 'path';

const expectedOGGAudioDuration = 33;
const expectedFLACAudioDuration = 97;
const expectedAudioDurationThreshold = 1;

const sampleOGGFilePath = resolvePath(__dirname, './Rayman_2_music_sample.ogg');
const sampleOGGWithSpacesFilePath = resolvePath(
  __dirname,
  './Rayman 2 music sample.ogg',
);
const sampleFLACFilePath = resolvePath(
  __dirname,
  './2L-125_stereo-44k-16b_04.flac',
);

import getDuration, { getAudioDurationInSeconds } from '../src/index';

describe('get-audio-duration', function () {
  it('Should export function under named export, too', function () {
    expect(getDuration).to.equal(getAudioDurationInSeconds);
  });

  context('When using a readable stream', function () {
    it('Should return proper duration', async function () {
      const inputFileReadStream = fs.createReadStream(sampleFLACFilePath);
      const duration = await getDuration(inputFileReadStream);
      expect(duration)
        .to.be.a('number')
        .that.is.closeTo(
          expectedFLACAudioDuration,
          expectedAudioDurationThreshold,
        );
    });

    it('Should throw an error if not an audio stream', async function () {
      const inputFileReadStream = fs.createReadStream(
        resolvePath(__dirname, __filename),
      );
      const durationPromise = getDuration(inputFileReadStream);
      await expect(durationPromise).to.be.eventually.rejected;
    });
  });

  context('When using a file path', function () {
    it('Should return proper duration', async function () {
      const duration = await getDuration(sampleOGGFilePath);
      expect(duration)
        .to.be.a('number')
        .that.is.closeTo(
          expectedOGGAudioDuration,
          expectedAudioDurationThreshold,
        );
    });

    it('Should throw an error if not an audio file', async function () {
      const durationPromise = getDuration(resolvePath(__dirname, __filename));
      await expect(durationPromise).to.be.eventually.rejected;
    });

    it('Should return proper duration if file contains spaces', async function () {
      const duration = await getDuration(sampleOGGWithSpacesFilePath);
      expect(duration)
        .to.be.a('number')
        .that.is.closeTo(
          expectedOGGAudioDuration,
          expectedAudioDurationThreshold,
        );
    });
  });
});
