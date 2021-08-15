import { MarusyaResponse } from '../../../src/marusya/response';
import data from '../../../data/marusya/request.json';

describe('marusya response', () => {
  let res: MarusyaResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as MarusyaResponse;
  });

  it('text', () => {
    res.bubbles.push('привет');
    res.bubbles.push('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'как дела' ],
      tts: '',
      end_session: false,
      buttons: [],
    });
  });

  it('tts', () => {
    res.tts = 'привет';
    res.tts += ' как дела';
    assert.deepEqual(res.body.response, {
      text: [],
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('suggest', () => {
    res.suggest.push('кнопка');
    assert.deepEqual(res.body.response, {
      text: [],
      tts: '',
      end_session: false,
      buttons: [ { title: 'кнопка' }],
    });
  });

  it('endSession', () => {
    res.endSession = true;
    assert.deepEqual(res.body.response, {
      text: [],
      tts: '',
      end_session: true,
      buttons: [],
    });
  });

  it('image', () => {
    res.bubbles.push({ imageId: '42', title: 'картинка', description: 'описание' });
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

});
