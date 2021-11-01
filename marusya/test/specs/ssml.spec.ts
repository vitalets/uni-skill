import data from '../../data/request.json';

describe('marusya ssml ', () => {
  function assertVoice(ssml: string, expected: string) {
    const res = createResponse(data);
    res.addVoice(ssml);
    assert.equal(res.body.response.tts, expected, ssml);
  }

  it('convert audio (build-in)', () => {
    assertVoice(
      'звук <audio src="marusia-sounds/game-win-1" />',
      'звук <speaker audio="marusia-sounds/game-win-1">',
    );
  });

  it('convert audio (vk)', () => {
    assertVoice(
      'звук <audio src="-2000000002_123456789" />',
      'звук <speaker audio_vk_id="-2000000002_123456789">',
    );
  });

});
