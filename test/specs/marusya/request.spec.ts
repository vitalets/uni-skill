import data from '../../../data/marusya/request.json';
import { MarusyaRequest } from '../../../src';

describe('marusya request', () => {

  const req = createReq(data) as MarusyaRequest;

  it('isMarusya', () => {
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), true);
  });

  it('userId', () => {
    assert.equal(req.userId, '52f12d70fb4077f68880010513d3382156f4b3a34fe176baae6ff9d74c006c51');
  });

  it('userMessage', () => {
    assert.equal(req.userMessage, 'привет');
  });

  it('clientInfo', () => {
    assert.equal(req.clientInfo, 'MailRu-VC/1.0; app: other');
  });

  it('isCloseApp', () => {
    const req = createReq(data, data => data.request.command = 'on_interrupt');
    assert.equal(req.userMessage, 'привет');
    assert.equal(req.isCloseApp(), true);
  });

  it('sessionState', () => {
    const req = createReq(data, data => data.state.session = { baz: 44 }) as MarusyaRequest;
    assert.deepEqual(req.sessionState, { baz: 44 });
  });

  it('userState', () => {
    const req = createReq(data, data => data.state.user = { data: { bar: 43 } }) as MarusyaRequest;
    assert.deepEqual(req.userState, { bar: 43 });
  });
});
