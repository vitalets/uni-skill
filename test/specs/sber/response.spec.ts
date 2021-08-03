import { SberResponse } from '../../../src/sber/response';
import data from '../../data/sber/request/message-to-skill.json';

describe('marusya response', () => {
  let res: SberResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as SberResponse;
  });

  it('text', () => {
    res.text = 'привет';
    assert.deepEqual(res.body.payload.items, [ { bubble: { text: 'привет' } } ]);
  });

  it('tts', () => {
    res.tts = 'привет';
    assert.deepEqual(res.body.payload.pronounceText, 'привет');
  });

  it('addButtons', () => {
    res.addButtons([ 'кнопка' ]);
    assert.deepEqual(res.body.payload.suggestions, {
      buttons: [{
        title: 'кнопка',
        action: { type: 'text', text: 'кнопка' }
      }]
    });
  });

  it('endSession', () => {
    res.endSession = true;
    assert.deepEqual(res.body.payload.finished, true);
  });

});
