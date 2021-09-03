import { AliceResponse } from '../../../src/alice/response';
import data from '../../../data/alice/request.json';

describe('alice ssml ', () => {
  function assertVoice(ssml: string, expected: string) {
    const res = createRes(data) as AliceResponse;
    res.addVoice(ssml);
    assert.equal(res.body.response.tts, expected, ssml);
  }

  it('convert pause (ms)', () => {
    assertVoice(
      'пауза <break time="200ms" />',
      'пауза sil <[200]>',
    );
  });

  it('convert pause (s)', () => {
    assertVoice(
      'пауза <break time="2s" />',
      'пауза sil <[2000]>',
    );
  });

  it('convert pause (default)', () => {
    assertVoice(
      'пауза <break />',
      'пауза sil <[500]>',
    );
  });

  it('convert audio', () => {
    assertVoice(
      'звук <audio src="file.opus" />',
      'звук <speaker audio="file.opus">',
    );
  });

});
