import IntentRequest from '../../../data/alexa/IntentRequest.json';
import SessionEndedRequest from '../../../data/alexa/SessionEndedRequest.json';
import { AlexaRequest } from '../../../src';

describe('alexa request', () => {

  const req = createReq(IntentRequest) as AlexaRequest;

  it('isAlice', () => {
    assert.equal(req.isAlexa(), true);
  });

  it('userId', () => {
    assert.include(req.userId, 'amzn1.ask.account');
  });

  it('userMessage', () => {
    assert.equal(req.userMessage, '');
  });

  it('clientInfo', () => {
    assert.equal(req.clientInfo, 'Alexa device');
  });

  it('isCloseApp', () => {
    const closeReq = createReq(SessionEndedRequest);
    assert.equal(req.isCloseApp(), false);
    assert.equal(closeReq.isCloseApp(), true);
  });

  it('sessionState', () => {
    const req = createReq(IntentRequest, data => data.session.attributes = { baz: 44 }) as AlexaRequest;
    assert.deepEqual(req.sessionState, { baz: 44 });
  });

  it('intent', () => {
    assert.deepEqual(req.getIntent('NumberGuessIntent'), {
      name: 'NumberGuessIntent',
      slots: { number: '10' }
    });
  });
});
