import data from '../../data/IntentRequest.json';
import SessionEndedRequest from '../../data/SessionEndedRequest.json';

describe('alexa request', () => {

  it('main props', () => {
    const req = createRequest(data);
    assert.equal(req.isAlexa(), true, 'isAlexa');
    assert.match(req.userId, /amzn1.+/, 'userId');
    assert.equal(req.userMessage, '', 'userMessage');
    assert.equal(req.clientInfo, 'Alexa device', 'clientInfo');
    assert.equal(req.isCloseApp(), false, 'isCloseApp');
  });

  it('isCloseApp', () => {
    const req = createRequest(SessionEndedRequest);
    assert.equal(req.isCloseApp(), true);
  });

  it('sessionState', () => {
    const newData = patch(data, data => data.session.attributes = { baz: 44 });
    const req = createRequest(newData);
    assert.deepEqual(req.sessionState, { baz: 44 });
  });

  it('intent', () => {
    const req = createRequest(data);
    assert.deepEqual(req.getIntent('NumberGuessIntent'), {
      name: 'NumberGuessIntent',
      slots: { number: '10' }
    });
  });
});
