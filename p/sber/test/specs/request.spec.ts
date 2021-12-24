import data from '../../data/request/message-to-skill.json';
import closeAppData from '../../data/request/close-app.json';

describe('sber request', () => {

  it('main props', () => {
    const req = createRequest(data);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, 'начинаем раз два три', 'userMessage');
    assert.equal(req.clientInfo, 'IOS 14.7.1; iPhone9,3; COMPANION 21.8.1000', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
  });

  it('isEndSession: true', () => {
    const req = createRequest(closeAppData);
    assert.equal(req.isEndSession(), true);
  });

  it('intent', () => {
    const req = createRequest(data);
    assert.deepEqual(req.getIntent('run_app'), {
      name: 'run_app',
      slots: {},
    });
  });

  it('ping', () => {
    const req = createRequest(data);
    assert.equal(req.isPing(), false);
  });
});
