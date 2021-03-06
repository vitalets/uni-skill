import data from '../../data/request.json';

describe('marusya request', () => {

  it('main props', () => {
    const req = createRequest(data);
    assert.equal(req.isMarusya(), true, 'isMarusya');
    assert.equal(req.platform, 'marusya', 'platform');
    assert.equal(req.userId, '52f12d70fb4077f68880010513d3382156f4b3a34fe176baae6ff9d74c006c51', 'userId');
    assert.equal(req.userMessage, 'привет', 'userMessage');
    assert.equal(req.clientInfo, 'MailRu-VC/1.0; app: other', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
  });

  it('isEndSession: true', () => {
    const newData = patch(data, data => data.request.command = 'on_interrupt');
    const req = createRequest(newData);
    assert.equal(req.userMessage, 'привет');
    assert.equal(req.isEndSession(), true);
  });

  it('sessionState', () => {
    const newData = patch(data, data => data.state.session = { baz: 44 });
    const req = createRequest(newData);
    assert.deepEqual(req.sessionState, { baz: 44 });
  });

  it('userState', () => {
    const newData = patch(data, data => data.state.user = { data: { bar: 43 } });
    const req = createRequest(newData);
    assert.deepEqual(req.userState, { bar: 43 });
  });

  it('ping', () => {
    const req = createRequest(data);
    assert.equal(req.isPing(), false);
    const newData = patch(data, data => data.meta.test = true);
    const pingReq = createRequest(newData);
    assert.equal(pingReq.isPing(), true);
  });

  it('getTimezone', () => {
    const req = createRequest(data);
    assert.equal(req.getTimezone(), 'Europe/Moscow');
  });
});
