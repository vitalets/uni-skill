import { GalleryCard } from '@salutejs/types';
import { SberResponse } from '../../../src/sber/response';
import data from '../../data/sber/request/message-to-skill.json';

describe('sber response', () => {
  let res: SberResponse;

  beforeEach(() => {
    res = createResponse(createRequest(data)) as SberResponse;
  });

  it('addText', () => {
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.payload.items, [
      { bubble: { text: 'привет' } },
      { bubble: { text: 'как дела' } },
    ]);
  });

  it('addTts', () => {
    res.addTts('привет');
    res.addTts('как дела');
    assert.deepEqual(res.body.payload.pronounceText, 'привет как дела');
  });

  it('addSuggest', () => {
    res.addSuggest([ 'кнопка' ]);
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

  it('addImage', () => {
    const id = 'https://path.to/image.png|hash1234567';
    res.addImage({ id, title: 'картинка', description: 'описание', ratio: 0.5 });
    const galItem = (res.body.payload.items[0].card as GalleryCard).items[0];
    assert.deepInclude(galItem.image, { url: 'https://path.to/image.png', hash: 'hash1234567' });
    assert.deepInclude(galItem.image, { size: { aspect_ratio: 0.5, width: 'large' }});
    assert.deepInclude(galItem.top_text, { text: 'картинка' });
    assert.deepInclude(galItem.bottom_text, { text: 'описание' });
  });

});
