import { AliceResponse } from '../../../src/alice/response';
import data from '../../data/alice/request.json';

describe('alice response', () => {
  let res: AliceResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as AliceResponse;
  });

  it('addText', () => {
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      text: 'привет\nкак дела',
      end_session: false,
      buttons: [],
    });
  });

  it('addTts', () => {
    res.addTts('привет');
    res.addTts('как дела');
    assert.deepEqual(res.body.response, {
      text: '',
      tts: 'привет как дела',
      end_session: false,
      buttons: [],
    });
  });

  it('addButtons', () => {
    res.addButtons([ 'кнопка' ]);
    assert.deepEqual(res.body.response, {
      text: '',
      end_session: false,
      buttons: [ { title: 'кнопка', hide: true }],
    });
  });

  it('endSession', () => {
    res.endSession = true;
    assert.deepEqual(res.body.response, {
      text: '',
      end_session: true,
      buttons: [],
    });
  });

  it('addImage', () => {
    res.addImage({ id: '42', title: 'картинка', description: 'описание' });
    assert.deepEqual(res.body.response, {
      text: 'картинка\nописание',
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
