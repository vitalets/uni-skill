import data from '../../data/IntentRequest.json';

describe('alexa response', () => {

  it('main props', () => {
    const res = createResponse(data);
    assert.equal(res.isMale, false, 'isMale');
    assert.equal(res.isOfficial, true, 'isOfficial');
    assert.equal(res.assistantName, 'Alexa', 'assistantName');
  });

  it('text', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      card: {
        type: 'Simple',
        title: '',
        content: 'привет\nкак дела',
      },
      shouldEndSession: false
    });
  });

  it('voice', () => {
    const res = createResponse(data);
    res.addVoice('привет');
    res.addVoice('как дела');
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: '<speak>привет как дела</speak>'
      },
      shouldEndSession: false
    });
  });

  it('voice', () => {
    const res = createResponse(data);
    res.addVoice('привет');
    res.addVoice('как дела');
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: '<speak>привет как дела</speak>'
      },
      shouldEndSession: false
    });
  });

  it('text + voice', () => {
    const res = createResponse(data);
    res.addVoiceText('привет');
    res.addVoiceText('как дела');
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: '<speak>привет как дела</speak>'
      },
      card: {
        type: 'Simple',
        title: '',
        content: 'привет\nкак дела',
      },
      shouldEndSession: false
    });
  });

  it('suggest (noop)', () => {
    const res = createResponse(data);
    res.addSuggest([ 'кнопка 1' ]);
    res.addSuggest([ 'кнопка 2' ]);
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      shouldEndSession: false
    });
  });

  it('endSession', () => {
    const res = createResponse(data);
    res.endSession(true);
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      shouldEndSession: true
    });
  });

  it('image', () => {
    const res = createResponse(data);
    res.addImage({
      imageId: 'https://small-image|https://large-image',
      title: 'картинка',
      description: 'описание',
      ratio: 1,
    });
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      card: {
        type: 'Standard',
        title: 'картинка',
        text: 'описание',
        image: {
          smallImageUrl: 'https://small-image',
          largeImageUrl: 'https://large-image'
        }
      },
      shouldEndSession: false
    });
  });

  it('text + image + text', () => {
    const res = createResponse(data);
    res.addText('привет');
    res.addImage({ imageId: 'https://image', title: 'картинка', description: 'описание', ratio: 1 });
    res.addText('как дела');
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      card: {
        type: 'Standard',
        title: 'картинка',
        text: 'привет\nописание\nкак дела',
        image: {
          smallImageUrl: 'https://image',
          largeImageUrl: 'https://image'
        }
      },
      shouldEndSession: false
    });
  });

  it('sessionState', () => {
    const res = createResponse(data);
    res.sessionState = { foo: 42 };
    assert.deepEqual(res.body.sessionAttributes, { foo: 42 });
  });

  it('link (noop)', () => {
    const res = createResponse(data);
    res.addLink({ title: 'ссылка', url: 'https://ya.ru', imageId: '' });
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      shouldEndSession: false
    });
  });

  it('reprompt', () => {
    const res = createResponse(data);
    res.addReprompt('привет');
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      reprompt: {
        outputSpeech: {
          type: 'SSML',
          ssml: '<speak>привет</speak>'
        }
      },
      shouldEndSession: false
    });
  });
});
