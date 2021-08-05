import { MarusyaResponse } from '../../../src/marusya/response';
import data from '../../data/marusya/request.json';

describe('marusya response', () => {
  let res: MarusyaResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as MarusyaResponse;
  });

  it('addText', () => {
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      text: [ 'привет', 'как дела' ],
      end_session: false,
      buttons: [],
    });
  });

  it('addTts', () => {
    res.addTts('привет');
    res.addTts('как дела');
    assert.deepEqual(res.body.response, {
      text: [],
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('addSuggest', () => {
    res.addSuggest([ 'кнопка' ]);
    assert.deepEqual(res.body.response, {
      text: [],
      end_session: false,
      buttons: [ { title: 'кнопка' }],
    });
  });

  it('endSession', () => {
    res.endSession = true;
    assert.deepEqual(res.body.response, {
      text: [],
      end_session: true,
      buttons: [],
    });
  });

  it('addImage', () => {
    res.addImage({ id: '42', title: 'картинка', description: 'описание' });
    assert.deepEqual(res.body.response, {
      text: [ 'картинка', 'описание' ],
      card: {
        type: 'BigImage',
        image_id: 42,
      },
      end_session: false,
      buttons: [],
    });
  });

});
