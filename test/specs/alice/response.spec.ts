import { AliceResponse } from '../../../src/alice/response';
import data from '../../../data/alice/request.json';

describe('alice response', () => {
  let res: AliceResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as AliceResponse;
  });

  it('text', () => {
    res.bubbles.push('привет');
    res.bubbles.push('как дела');
    assert.deepEqual(res.body.response, {
      text: 'привет\nкак дела',
      tts: '',
      end_session: false,
      buttons: [],
    });
  });

  it('tts', () => {
    res.tts = 'привет';
    res.tts += ' как дела';
    assert.deepEqual(res.body.response, {
      text: '',
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('suggest', () => {
    res.suggest.push('кнопка');
    assert.deepEqual(res.body.response, {
      text: '',
      tts: '',
      end_session: false,
      buttons: [ { title: 'кнопка', hide: true }],
    });
  });

  it('endSession', () => {
    res.endSession = true;
    assert.deepEqual(res.body.response, {
      text: '',
      tts: '',
      end_session: true,
      buttons: [],
    });
  });

  it('image', () => {
    res.bubbles.push({ imageId: '42', title: 'картинка', description: 'описание' });
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

});
