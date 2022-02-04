import data from '../../data/request.json';

// тест на respeech только в алисе, т.к. логика одинаковая для всех платформ

describe('respeech', () => {

  it('enabled', () => {
    const res = createResponse(data);
    res.config.respeech = true;
    res.isOfficial = true;
    res.isMale = false;
    res.addVoiceText('Я думал[а] {ты|вы} {знаешь|знаете}');
    assert.deepEqual(res.body.response, {
      text: 'Я думала вы знаете',
      tts: 'Я думала вы знаете',
      end_session: false,
      buttons: [],
    });
  });

  it('disabled', () => {
    const res = createResponse(data);
    res.isOfficial = true;
    res.isMale = false;
    res.addVoiceText('Я думал[а] {ты|вы} {знаешь|знаете}');
    assert.deepEqual(res.body.response, {
      text: 'Я думал[а] {ты|вы} {знаешь|знаете}',
      tts: 'Я думал[а] {ты|вы} {знаешь|знаете}',
      end_session: false,
      buttons: [],
    });
  });

});
