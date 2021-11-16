import data from '../../data/request.json';

describe('alice request', () => {

  it('main props', () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), true, 'isAlice');
    assert.equal(req.platform, 'alice', 'platform');
    assert.match(req.userId, /92DE93E7BC5D.+/, 'userId');
    assert.equal(req.userMessage, 'привет 1', 'userMessage');
    assert.equal(req.clientInfo, 'ru.yandex.mobile/7300 (Apple iPhone; iphone 14.6)', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
  });

  it('sessionState', () => {
    const newData = patch(data, data => data.state.session = { baz: 44 });
    const req = createRequest(newData);
    assert.deepEqual(req.sessionState, { baz: 44 });
  });

  it('applicationState', () => {
    const newData = patch(data, data => data.state.application = { foo: 42 });
    const req = createRequest(newData);
    assert.deepEqual(req.applicationState, { foo: 42 });
  });

  it('userState', () => {
    const newData = patch(data, data => data.state.user = { data: { bar: 43 } });
    const req = createRequest(newData);
    assert.deepEqual(req.userState, { bar: 43 });
  });
});
