import data from '../../data/request/message-to-skill.json';
import messageToSkillTap from '../../data/request/message-to-skill_tap_suggest.json';
import messageToSkillQuestion from '../../data/request/message-to-skill_question.json';
import messageToSkillEng from '../../data/request/message-to-skill_eng.json';
import closeAppData from '../../data/request/close-app.json';
import runAppData from '../../data/request/run-app-sberbox.json';

describe('sber request', () => {

  it('main props (MESSAGE_TO_SKILL)', () => {
    const req = createRequest(data);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, 'начинаем 1 2 3', 'userMessage');
    assert.equal(req.clientInfo, 'IOS 14.7.1; iPhone9,3; COMPANION 21.8.1000', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
    assert.equal(req.getTimezone(), 'Europe/Moscow');
  });

  it('userMessage (MESSAGE_TO_SKILL, tap suggest)', () => {
    const req = createRequest(messageToSkillTap);
    assert.equal(req.userMessage, 'сидеть в телефоне');
  });

  it('userMessage (MESSAGE_TO_SKILL, question) - удаляем знак вопроса', () => {
    const req = createRequest(messageToSkillQuestion);
    assert.equal(req.userMessage, 'какой сегодня день');
  });

  it('userMessage (MESSAGE_TO_SKILL, eng) - берем вариант без английских букв', () => {
    const req = createRequest(messageToSkillEng);
    assert.equal(req.userMessage, 'не вор');
  });

  it('main props (RUN_APP, sberbox)', () => {
    const req = createRequest(runAppData);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, '', 'userMessage');
    assert.equal(req.clientInfo, 'android 9; sberbox; SBERBOX 1.74.76', 'clientInfo');
    assert.equal(req.isEndSession(), false, 'isEndSession');
    assert.equal(req.getTimezone(), 'Europe/Moscow');
  });

  it('main props (CLOSE_APP)', () => {
    const req = createRequest(closeAppData);
    assert.equal(req.isSber(), true);
    assert.equal(req.platform, 'sber', 'platform');
    assert.match(req.userId, /8tet.+/, 'userId');
    assert.equal(req.userMessage, 'выйти', 'userMessage');
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

  it('ping', () => {
    const req = createRequest(data);
    assert.equal(req.isPing(), false);
  });
});
