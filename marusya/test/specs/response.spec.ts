import data from '../../data/request.json';

describe('marusya response', () => {

  it('main props', () => {
    const res = createResponse(data);
    assert.equal(res.isMale, false, 'isMale');
    assert.equal(res.isOfficial, true, 'isOfficial');
    assert.equal(res.assistantName, 'Маруся', 'assistantName');
  });

  it('text', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'как дела' ],
      tts: '',
      end_session: false,
      buttons: [],
    });
  });

  it('voice', () => {
    const res = createResponse(data);
    res.addVoice('привет');
    res.addVoice('как дела');
    assert.deepEqual(res.body.response, {
      text: [],
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('text + voice', () => {
    const res = createResponse(data);
    res.addVoiceText('привет');
    res.addVoiceText('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'как дела' ],
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('suggest', () => {
    const res = createResponse(data);
    res.addSuggest([ 'кнопка 1' ]);
    res.addSuggest([ 'кнопка 2' ]);
    assert.deepEqual(res.body.response, {
      text: [],
      tts: '',
      end_session: false,
      buttons: [
        { title: 'кнопка 1' },
        { title: 'кнопка 2' },
      ],
    });
  });

  it('endSession', () => {
    const res = createResponse(data);
    res.endSession(true);
    assert.deepEqual(res.body.response, {
      text: [],
      tts: '',
      end_session: true,
      buttons: [],
    });
  });

  it('sessionState', () => {
    const res = createResponse(data);
    res.sessionState = { foo: 42 };
    assert.deepEqual(res.body.session_state, { foo: 42 });
  });

  it('userState', () => {
    const res = createResponse(data);
    res.userState = { foo: 42 };
    assert.deepEqual(res.body.user_state_update, { data: { foo: 42 }});
  });

  it('image', () => {
    const res = createResponse(data);
    res.addImage({ imageId: '42', title: 'картинка', description: 'описание', ratio: 1 });
    assert.deepEqual(res.body.response, {
      text: [ 'картинка', 'описание' ],
      tts: '',
      card: {
        type: 'BigImage',
        image_id: 42,
      },
      end_session: false,
      buttons: [],
    });
  });

  it('text + image + text', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addImage({ imageId: '42', title: 'картинка', description: 'описание', ratio: 1 });
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'картинка', 'описание', 'как дела' ],
      tts: '',
      card: {
        type: 'BigImage',
        image_id: 42,
      },
      end_session: false,
      buttons: [],
    });
  });

  it('link', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addLink({ title: 'ссылка', url: 'https://ya.ru', imageId: '123' });
    assert.deepEqual(res.body.response, {
      text: [ 'привет' ],
      tts: '',
      card: {
        type: 'Link',
        url: 'https://ya.ru',
        title: 'ссылка',
        text: '',
        image_id: 123,
      },
      end_session: false,
      buttons: [],
    });
  });

  it('image + link', () => {
    const res = createResponse(data);
    assert.throws(() => {
      res.addImage({ imageId: '42', title: 'картинка', description: 'описание', ratio: 1 });
      res.addLink({ title: 'ссылка', url: 'https://ya.ru', imageId: '123' });
    }, /Response already contains card: BigImage/);
  });

});
