import data from '../../../data/sber/request/message-to-skill.json';
import closeAppData from '../../../data/sber/request/close-app.json';
import { SberRequest } from '../../../src';

describe('sber request', () => {

  const req = createReq(data) as SberRequest;

  it('isSber', () => {
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), true);
    assert.equal(req.isMarusya(), false);
  });

  it('userId', () => {
    assert.equal(req.userId.slice(0, 10), '8tet/qbl+C');
  });

  it('userMessage', () => {
    assert.equal(req.userMessage, 'начинаем раз два три');
  });

  it('clientInfo', () => {
    assert.equal(req.clientInfo, 'IOS 14.7.1; iPhone9,3; COMPANION 21.8.1000');
  });

  it('isCloseApp', () => {
    const req = createReq(closeAppData);
    assert.equal(req.isCloseApp(), true);
  });

});
