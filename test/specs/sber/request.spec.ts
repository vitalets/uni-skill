import data from '../../data/sber/request/message-to-skill.json';

describe('sber request', () => {

  it('isAlice / isSber / isMarusya', async () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), true);
    assert.equal(req.isMarusya(), false);
  });

});
