import data from '../../data/request.json';

describe('alice ssml ', () => {
  function assertVoice(ssml: string, expected: string) {
    const res = createResponse(data);
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

  it('strip all tags from text', () => {
    const res = createResponse(data);
    res.addText([
      'привет<break time="200ms" />',
      '<audio src="url"/><sub alias="щета">счета</sub>.',
    ].join(' '));
    assert.equal(res.body.response.text, 'привет счета.');
  });

});
