import { GalleryCard } from '@salutejs/types';
import { SberResponse } from '../../../src/sber/response';
import data from '../../../data/sber/request/message-to-skill.json';

describe('sber response', () => {
  let res: SberResponse;

  beforeEach(() => {
    res = createRes(data) as SberResponse;
  });

  it('text', () => {
    res.addText('привет');
    res.addText('как дела');
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
    res.addVoiceText('прив+ет');
    res.addVoiceText('как дела');
    assert.deepEqual(res.body.payload.pronounceText, 'приве\'т как дела');
    assert.deepEqual(res.body.payload.items, [
      { bubble: { text: 'привет' } },
      { bubble: { text: 'как дела' } },
    ]);
  });

  it('suggest', () => {
    res.addSuggest([ 'кнопка 1' ]);
    res.addSuggest([ 'кнопка 2' ]);
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
    const imageId = 'https://image.png|hash12345';
    res.addImage({ imageId, title: 'картинка', description: 'описание', ratio: 0.5 });
    const imgItem = (res.body.payload.items[0].card as GalleryCard).items[0];
    assert.deepInclude(imgItem.image, { url: 'https://image.png', hash: 'hash12345' });
    assert.deepInclude(imgItem.image, { size: { aspect_ratio: 0.5, width: 'large' }});
    assert.deepInclude(imgItem.top_text, { text: 'картинка' });
    assert.deepInclude(imgItem.bottom_text, { text: 'описание' });
  });

  it('text + image + text', () => {
    res.addText('привет');
    const imageId = 'https://image.png|hash12345';
    res.addImage({ imageId, title: 'картинка', description: 'описание', ratio: 0.5 });
    res.addText('как дела');

    assert.deepEqual(res.body.payload.items[0], { bubble: { text: 'привет' } });
    const imgItem = (res.body.payload.items[1].card as GalleryCard).items[0];
    assert.deepInclude(imgItem.image, { url: 'https://image.png', hash: 'hash12345' });
    assert.deepInclude(imgItem.image, { size: { aspect_ratio: 0.5, width: 'large' }});
    assert.deepInclude(imgItem.top_text, { text: 'картинка' });
    assert.deepInclude(imgItem.bottom_text, { text: 'описание' });
    assert.deepEqual(res.body.payload.items[2], { bubble: { text: 'как дела' } });
  });

  it('modifications of body saved after updates', () => {
    res.addImage({ imageId: 'foo|bar', title: 'картинка', description: 'описание', ratio: 0.5 });
    // @ts-expect-error card is unknown
    res.body.payload.items[0].card.items[0].image.size.width = 'resizable';
    res.addText('привет');
    // @ts-expect-error card is unknown
    assert.deepInclude(res.body.payload.items[0].card.items[0].image, {
      size: { aspect_ratio: 0.5, width: 'resizable' }
    });
  });

  it('link', () => {
    res.addLink({ title: 'ссылка', url: 'https://ya.ru' });
    assert.deepEqual(res.body.payload.items[0], {
      card: {
        type: 'list_card',
        cells: [
          {
            type: 'button_cell_view',
            content: {
              text: 'ссылка',
              typeface: 'button1',
              style: 'default',
              type: 'accept',
              actions: [{
                type: 'deep_link',
                deep_link: 'https://ya.ru'
              }],
            }
          }
        ]
      }
    });
  });

});
