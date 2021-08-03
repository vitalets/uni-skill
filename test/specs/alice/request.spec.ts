import data from '../../data/alice/request.json';

describe('alice request', () => {

  it('isAlice', () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), true);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), false);
  });

  it('userMessage', () => {
    const req = createRequest(data);
    assert.equal(req.userMessage, 'привет 1');
  });
});
