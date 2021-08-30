import IntentRequest from '../../../data/alexa/IntentRequest.json';
import { AlexaResponse } from '../../../src/alexa/response';

describe('marusya response', () => {
  let res: AlexaResponse;

  beforeEach(() => {
    res = createRes(IntentRequest) as AlexaResponse;
  });

  it('text', () => {
    res.addBubble('привет');
    res.addBubble('как дела');
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
    res.addVoiceBubble('привет');
    res.addVoiceBubble('как дела');
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
    res.addSuggest([ 'кнопка 1', 'кнопка 2' ]);
    assert.deepEqual(res.body.response, {
      outputSpeech: {
        type: 'SSML',
        ssml: ''
      },
      shouldEndSession: false
    });
  });

  it('endSession', () => {
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
    res.addBubble({
      imageId: 'https://small-image|https://large-image',
      title: 'картинка',
      description: 'описание'
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

  it('sessionState', () => {
    res.sessionState = { foo: 42 };
    assert.deepEqual(res.body.sessionAttributes, { foo: 42 });
  });

});
