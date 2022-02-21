import data from '../../data/request/message-to-skill.json';

describe('sber request', () => {

  it('main props (MESSAGE_TO_SKILL)', () => {
    const req = createRequest(data);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, 'начинаем 1 2 3', 'userMessage');
    assert.equal(req.hasScreen, true, 'hasScreen');
    assert.equal(req.clientInfo, 'IOS 14.7.1; iPhone9,3; COMPANION 21.8.1000', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
    assert.equal(req.getTimezone(), 'Europe/Moscow');
  });

  it('userMessage (MESSAGE_TO_SKILL, tap suggest)', async () => {
    const data = await import('../../data/request/message-to-skill_tap_suggest.json');
    const req = createRequest(data);
    assert.equal(req.userMessage, 'сидеть в телефоне');
  });

  it('userMessage (MESSAGE_TO_SKILL, question) - удаляем знак вопроса', async () => {
    const data = await import('../../data/request/message-to-skill_question.json');
    const req = createRequest(data);
    assert.equal(req.userMessage, 'какой сегодня день');
  });

  it('userMessage (MESSAGE_TO_SKILL, eng) - берем вариант без английских букв', async () => {
    const data = await import('../../data/request/message-to-skill_eng.json');
    const req = createRequest(data);
    assert.equal(req.userMessage, 'не вор');
  });

  it('main props (RUN_APP, sberbox)', async () => {
    const data = await import('../../data/request/run-app-sberbox.json');
    const req = createRequest(data);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, '', 'userMessage');
    assert.equal(req.hasScreen, true, 'hasScreen');
    assert.equal(req.clientInfo, 'android 9; sberbox; SBERBOX 1.74.76', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
    assert.equal(req.getTimezone(), 'Europe/Moscow');
  });

  it('main props (CLOSE_APP)', async () => {
    const data = await import('../../data/request/close-app.json');
    const req = createRequest(data);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, 'выйти', 'userMessage');
    assert.equal(req.hasScreen, true, 'hasScreen');
    assert.equal(req.clientInfo, 'ANDROID 6.0; PLK-L01; COMPANION 22.01.1.8515', 'clientInfo');
    assert.equal(req.isEndSession(), true, 'isEndSession');
    assert.equal(req.getTimezone(), ''); // в CLOSE_APP таймзона не передаётся
  });

  it('intent', () => {
    const req = createRequest(data);
    assert.deepEqual(req.getIntent('run_app'), {
      name: 'run_app',
      slots: {},
    });
  });

  it('hasScreen: no', async () => {
    const data = await import('../../data/request/message-to-skill_time-noscreen.json');
    const req = createRequest(data);
    assert.equal(req.hasScreen, false);
  });

  it('ping', () => {
    const req = createRequest(data);
    assert.equal(req.isPing(), false);
  });
});
