import { AliceResponse } from '../../../src/alice/response';
import data from '../../data/alice/request.json';

describe('alice response', () => {
  let res: AliceResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as AliceResponse;
  });

  it('text', () => {
    res.text = 'привет';
    assert.deepEqual(res.body.response, {
      text: 'привет',
      end_session: false,
      buttons: [],
    });
  });

  it('tts', () => {
    res.tts = 'привет';
    assert.deepEqual(res.body.response, {
      text: '',
      tts: 'привет',
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

});
