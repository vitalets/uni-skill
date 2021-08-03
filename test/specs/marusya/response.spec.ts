import { MarusyaResponse } from '../../../src/marusya/response';
import data from '../../data/marusya/request.json';

describe('marusya response', () => {
  let res: MarusyaResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as MarusyaResponse;
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
      buttons: [ { title: 'кнопка' }],
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
