import { AliceResponse } from '../../../src/alice/response';
import data from '../../../data/alice/request.json';

describe('alice ssml ', () => {
  function assertVoice(ssml: string, expectedTts: string) {
    const res = createRes(data) as AliceResponse;
    res.addVoice(ssml);
    assert.equal(res.body.response.tts, expectedTts, ssml);
  }

  it('pause', () => {
    assertVoice('при <break time="200ms" /> вет', 'при sil <[200]> вет');
  });

});
