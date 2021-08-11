import data from '../../../data/sber/request/message-to-skill.json';
import closeAppData from '../../../data/sber/request/close-app.json';

describe('sber request', () => {

  it('isSber', () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), true);
    assert.equal(req.isMarusya(), false);
  });

  it('userMessage', () => {
    const req = createRequest(data);
    assert.equal(req.userMessage, 'начинаем раз два три');
  });

  it('clientInfo', () => {
    const req = createRequest(data);
    assert.equal(req.clientInfo, 'IOS 14.7.1; iPhone9,3; COMPANION 21.8.1000');
  });

  it('isCloseApp', () => {
    const req = createRequest(closeAppData);
    assert.equal(req.isCloseApp(), true);
  });

});
