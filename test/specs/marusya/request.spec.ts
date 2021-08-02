import data from '../../data/marusya/request.json';

describe('marusya request', () => {

  it('isAlice / isSber / isMarusya', async () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), true);
  });

});
