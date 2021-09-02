import { MarusyaResponse } from '../../../src/marusya/response';
import data from '../../../data/marusya/request.json';

describe('marusya response', () => {
  let res: MarusyaResponse;

  beforeEach(() => {
    res = createRes(data) as MarusyaResponse;
  });

  it('text', () => {
    res.addBubble('привет');
    res.addBubble('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'как дела' ],
      tts: '',
      end_session: false,
      buttons: [],
    });
  });

  it('voice', () => {
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
    res.addVoiceBubble('привет');
    res.addVoiceBubble('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'как дела' ],
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('suggest', () => {
    res.addSuggest([ 'кнопка 1', 'кнопка 2' ]);
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
    res.endSession(true);
    assert.deepEqual(res.body.response, {
      text: [],
      tts: '',
      end_session: true,
      buttons: [],
    });
  });

  it('sessionState', () => {
    res.sessionState = { foo: 42 };
    assert.deepEqual(res.body.session_state, { foo: 42 });
  });

  it('userState', () => {
    res.userState = { foo: 42 };
    assert.deepEqual(res.body.user_state_update, { data: { foo: 42 }});
  });

  it('image', () => {
    res.addBubble({ imageId: '42', title: 'картинка', description: 'описание' });
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
    res.addBubble('привет');
    res.addBubble({ imageId: '42', title: 'картинка', description: 'описание' });
    res.addBubble('как дела');
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
    res.addBubble('привет');
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
    assert.throws(() => {
      res.addBubble({ imageId: '42', title: 'картинка', description: 'описание' });
      res.addLink({ title: 'ссылка', url: 'https://ya.ru', imageId: '123' });
    }, /Response already contains card: BigImage/);
  });

});
