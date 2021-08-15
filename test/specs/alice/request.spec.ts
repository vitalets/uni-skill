import data from '../../../data/alice/request.json';

describe('alice request', () => {

  it('isAlice', () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), true);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), false);
  });

  it('userId', () => {
    const req = createRequest(data);
    assert.equal(req.userId, '15B69EA115BD8D831AB0B66C8B9E880C0270916EEB040D47224A35996B233F96');
  });

  it('userMessage', () => {
    const req = createRequest(data);
    assert.equal(req.userMessage, 'привет 1');
  });

  it('clientInfo', () => {
    const req = createRequest(data);
    assert.equal(req.clientInfo, 'ru.yandex.mobile/7300 (Apple iPhone; iphone 14.6)');
  });

  it('isCloseApp', () => {
    const req = createRequest(data);
    assert.equal(req.isCloseApp(), false);
  });

});
