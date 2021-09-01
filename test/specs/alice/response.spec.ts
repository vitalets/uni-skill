import { AliceResponse } from '../../../src/alice/response';
import data from '../../../data/alice/request.json';

describe('alice response', () => {
  let res: AliceResponse;

  beforeEach(() => {
    res = createRes(data) as AliceResponse;
  });

  it('text', () => {
    res.addBubble('привет');
    res.addBubble('как дела');
    assert.deepEqual(res.body.response, {
      text: 'привет\nкак дела',
      tts: '',
      end_session: false,
      buttons: [],
    });
  });

  it('voice', () => {
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
    res.addVoiceBubble('привет');
    res.addVoiceBubble('как дела');
    assert.deepEqual(res.body.response, {
      text: 'привет\nкак дела',
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('suggest', () => {
    res.addSuggest([ 'кнопка 1', 'кнопка 2' ]);
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
    res.endSession(true);
    assert.deepEqual(res.body.response, {
      text: '',
      tts: '',
      end_session: true,
      buttons: [],
    });
  });

  it('image', () => {
    res.addBubble({ imageId: '42', title: 'картинка', description: 'описание' });
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

  it('text - image - text', () => {
    res.addBubble('привет');
    res.addBubble({ imageId: '42', title: 'картинка', description: 'описание' });
    res.addBubble('как дела');
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
    res.sessionState = { foo: 42 };
    assert.deepEqual(res.body.session_state, { foo: 42 });
  });

  it('applicationState', () => {
    res.applicationState = { foo: 42 };
    assert.deepEqual(res.body.application_state, { foo: 42 });
  });

  it('userState', () => {
    res.userState = { foo: 42 };
    assert.deepEqual(res.body.user_state_update, { data: { foo: 42 }});
  });

});
