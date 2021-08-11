import data from '../../../data/marusya/request.json';

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

  it('clientInfo', () => {
    const req = createRequest(data);
    assert.equal(req.clientInfo, 'MailRu-VC/1.0; app: other');
  });

  it('isCloseApp', () => {
    const closeAppData = JSON.parse(JSON.stringify(data)) as typeof data;
    closeAppData.request.command = 'on_interrupt';
    const req = createRequest(closeAppData);
    assert.equal(req.userMessage, 'привет');
    assert.equal(req.isCloseApp(), true);
  });
});
