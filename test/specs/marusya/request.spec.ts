import data from '../../data/marusya/request.json';

describe('marusya request', () => {

  it('isMarusya', () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), true);
  });

  it('userMessage', () => {
    const req = createRequest(data);
    assert.equal(req.userMessage, 'привет');
  });

});
