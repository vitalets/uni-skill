import data from '../../data/request.json';

describe('alice response', () => {

  it('main props', () => {
    const res = createResponse(data);
    assert.equal(res.platform, 'alice', 'platform');
    assert.equal(res.isMale, false, 'isMale');
    assert.equal(res.isOfficial, true, 'isOfficial');
    assert.equal(res.assistantName, 'Алиса', 'assistantName');
  });

  it('text', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      text: 'привет\nкак дела',
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
      text: '',
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
      text: 'привет\nкак дела',
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
      text: '',
      tts: '',
      end_session: false,
      buttons: [
        { title: 'кнопка 1', hide: true },
        { title: 'кнопка 2', hide: true },
      ],
    });
  });

  it('endSession', () => {
    const res = createResponse(data);
    res.endSession();
    assert.deepEqual(res.body.response, {
      text: '',
      tts: '',
      end_session: true,
      buttons: [],
    });
  });

  it('image', () => {
    const res = createResponse(data);
    res.addImage({ imageId: '42', title: 'картинка', description: 'описание', ratio: 1 });
    assert.deepEqual(res.body.response, {
      text: 'картинка\nописание',
      tts: '',
      card: {
        type: 'BigImage',
        image_id: '42',
        title: 'картинка',
        description: 'описание'
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
      text: 'привет\nкартинка\nописание\nкак дела',
      tts: '',
      card: {
        type: 'BigImage',
        image_id: '42',
        title: 'картинка',
        description: 'привет\nописание\nкак дела'
      },
      end_session: false,
      buttons: [],
    });
  });

  it('sessionState', () => {
    const res = createResponse(data);
    res.sessionState = { foo: 42 };
    assert.deepEqual(res.body.session_state, { foo: 42 });
  });

  it('applicationState', () => {
    const res = createResponse(data);
    res.applicationState = { foo: 42 };
    assert.deepEqual(res.body.application_state, { foo: 42 });
  });

  it('userState', () => {
    const res = createResponse(data);
    res.userState = { foo: 42 };
    assert.deepEqual(res.body.user_state_update, { data: { foo: 42 }});
  });

  it('link', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addLinks([ { title: 'ссылка', url: 'https://ya.ru', imageId: '' } ]);
    assert.deepEqual(res.body.response, {
      text: 'привет',
      tts: '',
      end_session: false,
      buttons: [{ url: 'https://ya.ru', title: 'ссылка', hide: false }],
    });
  });

  it('image + link', () => {
    const res = createResponse(data);
    res.addImage({ imageId: '42', title: 'картинка', description: 'описание', ratio: 1 });
    res.addLinks([{ title: 'ссылка', url: 'https://ya.ru', imageId: '' }]);
    assert.deepEqual(res.body.response, {
      text: 'картинка\nописание',
      tts: '',
      card: {
        type: 'BigImage',
        image_id: '42',
        title: 'картинка',
        description: 'описание',
        button: { url: 'https://ya.ru', text: 'ссылка' }
      },
      end_session: false,
      buttons: [],
    });
  });

  it('link + suggest', () => {
    const res = createResponse(data);
    res.addLinks([{ title: 'ссылка', url: 'https://ya.ru', imageId: '' }]);
    res.addSuggest([ 'кнопка 1' ]);
    assert.deepEqual(res.body.response, {
      text: '',
      tts: '',
      end_session: false,
      buttons: [
        { url: 'https://ya.ru', title: 'ссылка', hide: false },
        { title: 'кнопка 1', hide: true },
      ],
    });
  });

});
