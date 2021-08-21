import data from '../../../data/alice/request.json';
import { AliceRequest } from '../../../src';

describe('alice request', () => {

  const req = createReq(data) as AliceRequest;

  it('isAlice', () => {
    assert.equal(req.isAlice(), true);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), false);
  });

  it('userId', () => {
    assert.equal(req.userId, '15B69EA115BD8D831AB0B66C8B9E880C0270916EEB040D47224A35996B233F96');
  });

  it('userMessage', () => {
    assert.equal(req.userMessage, 'привет 1');
  });

  it('clientInfo', () => {
    assert.equal(req.clientInfo, 'ru.yandex.mobile/7300 (Apple iPhone; iphone 14.6)');
  });

  it('isCloseApp', () => {
    assert.equal(req.isCloseApp(), false);
  });

  it('sessionState', () => {
    const req = createReq(data, data => data.state.session = { baz: 44 }) as AliceRequest;
    assert.deepEqual(req.sessionState, { baz: 44 });
  });

  it('applicationState', () => {
    const req = createReq(data, data => data.state.application = { foo: 42 }) as AliceRequest;
    assert.deepEqual(req.applicationState, { foo: 42 });
  });

  it('userState', () => {
    const req = createReq(data, data => data.state.user = { data: { bar: 43 } }) as AliceRequest;
    assert.deepEqual(req.userState, { bar: 43 });
  });
});
