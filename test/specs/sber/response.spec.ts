import { GalleryCard } from '@salutejs/types';
import { SberResponse } from '../../../src/sber/response';
import data from '../../../data/sber/request/message-to-skill.json';

describe('sber response', () => {
  let res: SberResponse;

  beforeEach(() => {
    res = createRes(data) as SberResponse;
  });

  it('text', () => {
    res.addBubble('привет');
    res.addBubble('как дела');
    assert.deepEqual(res.body.payload.items, [
      { bubble: { text: 'привет' } },
      { bubble: { text: 'как дела' } },
    ]);
  });

  it('voice', () => {
    res.addVoice('привет');
    res.addVoice('как дела');
    assert.deepEqual(res.body.payload.pronounceText, 'привет как дела');
  });

  it('text + voice', () => {
    res.addVoiceBubble('привет');
    res.addVoiceBubble('как дела');
    assert.deepEqual(res.body.payload.pronounceText, 'привет как дела');
    assert.deepEqual(res.body.payload.items, [
      { bubble: { text: 'привет' } },
      { bubble: { text: 'как дела' } },
    ]);
  });

  it('suggest', () => {
    res.addSuggest([ 'кнопка 1', 'кнопка 2' ]);
    assert.deepEqual(res.body.payload.suggestions, {
      buttons: [
        { title: 'кнопка 1', action: { type: 'text', text: 'кнопка 1' }},
        { title: 'кнопка 2', action: { type: 'text', text: 'кнопка 2' }},
      ]
    });
  });

  it('endSession', () => {
    res.endSession(true);
    assert.deepEqual(res.body.payload.finished, true);
  });

  it('image', () => {
    const imageId = 'https://path.to/image.png|hash1234567';
    res.addBubble({ imageId, title: 'картинка', description: 'описание', ratio: 0.5 });
    const galItem = (res.body.payload.items[0].card as GalleryCard).items[0];
    assert.deepInclude(galItem.image, { url: 'https://path.to/image.png', hash: 'hash1234567' });
    assert.deepInclude(galItem.image, { size: { aspect_ratio: 0.5, width: 'large' }});
    assert.deepInclude(galItem.top_text, { text: 'картинка' });
    assert.deepInclude(galItem.bottom_text, { text: 'описание' });
  });

  it('modifications of body saved after updates', () => {
    res.addBubble({ imageId: 'foo|bar', title: 'картинка', description: 'описание', ratio: 0.5 });
    // @ts-expect-error card is unknown
    res.body.payload.items[0].card.items[0].image.size.width = 'resizable';
    res.addBubble('привет');
    // @ts-expect-error card is unknown
    assert.deepInclude(res.body.payload.items[0].card.items[0].image, {
      size: { aspect_ratio: 0.5, width: 'resizable' }
    });
  });

});
