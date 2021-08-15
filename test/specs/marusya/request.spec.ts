import data from '../../../data/marusya/request.json';

describe('marusya request', () => {

  it('isMarusya', () => {
    const req = createRequest(data);
    assert.equal(req.isAlice(), false);
    assert.equal(req.isSber(), false);
    assert.equal(req.isMarusya(), true);
  });

  it('userId', () => {
    const req = createRequest(data);
    assert.equal(req.userId, '52f12d70fb4077f68880010513d3382156f4b3a34fe176baae6ff9d74c006c51');
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
