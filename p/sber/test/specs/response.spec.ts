import { GalleryCard } from '@salutejs/types';
import data from '../../data/request/message-to-skill.json';

describe('sber response', () => {
  it('isMale', () => {
    const newData = patch(data, data => data.payload.character.gender = 'male');
    const res = createResponse(newData);
    assert.equal(res.isMale, true);
  });

  it('isOfficial', () => {
    const newData = patch(data, data => data.payload.character.appeal = 'unofficial');
    const res = createResponse(newData);
    assert.equal(res.isOfficial, false);
  });

  it('assistantName', () => {
    const newData = patch(data, data => data.payload.character.name = 'Афина');
    const res = createResponse(newData);
    assert.equal(res.assistantName, 'Афина');
  });

  it('text', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.payload.items, [
      { bubble: { text: 'привет' } },
      { bubble: { text: 'как дела' } },
    ]);
  });

  it('voice', () => {
    const res = createResponse(data);
    res.addVoice('привет');
    res.addVoice('как дела');
    assert.deepEqual(res.body.payload.pronounceText, 'привет как дела');
  });

  it('text + voice', () => {
    const res = createResponse(data);
    res.addVoiceText('привет');
    res.addVoiceText('как дела');
    assert.deepEqual(res.body.payload.pronounceText, 'привет как дела');
    assert.deepEqual(res.body.payload.items, [
      { bubble: { text: 'привет' } },
      { bubble: { text: 'как дела' } },
    ]);
  });

  it('suggest', () => {
    const res = createResponse(data);
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
    const res = createResponse(data);
    res.endSession(true);
    assert.deepEqual(res.body.payload.finished, true);
  });

  it('image', () => {
    const res = createResponse(data);
    const imageId = 'https://image.png|hash12345';
    res.addImage({ imageId, title: 'картинка', description: 'описание', ratio: 0.5 });
    const imgItem = (res.body.payload.items[0].card as GalleryCard).items[0];
    assert.deepInclude(imgItem.image, { url: 'https://image.png', hash: 'hash12345' });
    assert.deepInclude(imgItem.image, { size: { aspect_ratio: 0.5, width: 'large' }});
    assert.deepInclude(imgItem.top_text, { text: 'картинка' });
    assert.deepInclude(imgItem.bottom_text, { text: 'описание' });
  });

  it('text + image + text', () => {
    const res = createResponse(data);
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
    const res = createResponse(data);
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
    const res = createResponse(data);
    res.addLinks([{ title: 'ссылка', url: 'https://ya.ru', imageId: '' }]);
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
