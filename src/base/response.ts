/**
 * Base response.
 */

import { Bubble } from '../types/response';

/**
 * При обращении к этим свойствам выставляем флаг synced = false,
 * и потом при обращении к body синхронизируем значение в platformBody.
 * Такой механизм имеет следующие плюсы:
 * - более привычное апи: можно делать suggest.push('кнопка') вместо addSuggest('кнопка') итд
 * - более удобно читать данные из ответа (например получить все текста для пост-обработки).
 *   Если сразу писать в боди, то например для Алисы баблы схлопываются в один через \n и их придется обратно парсить.
 * - в реализациях вместо пары геттер/сеттер достаточно описать один sync* метод
 */
class UniBody {
  bubbles: Bubble[] = [];
  suggest: string[] = [];
  tts = '';
  endSession = false;
}

export abstract class BaseResponse<TBody, TReq> {
  /** Запрос, для которого этот ответ */
  protected request: TReq;
  /** Тело платформенного ответа */
  protected platformBody: TBody;
  /** Тело универсального ответа */
  protected uniBody = new UniBody();
  /** Флаг, что тела синхронизированы :) */
  protected synced = true;

  isMale = false;
  isOfficial = true;

  constructor(request: TReq) {
    this.request = request;
    this.platformBody = this.init();
    this.sync();
  }

  get body() {
    if (!this.synced) {
      this.synced = true;
      this.sync();
    }
    return this.platformBody;
  }

  // be carefull with overwriting full body!
  set body(value: TBody) {
    this.platformBody = value;
    this.synced = true;
  }

  get bubbles() { this.synced = false; return this.uniBody.bubbles; }
  set bubbles(v: Bubble[]) { this.synced = false; this.uniBody.bubbles = v; }

  get suggest() { this.synced = false; return this.uniBody.suggest; }
  set suggest(v: string[]) { this.synced = false; this.uniBody.suggest = v; }

  get tts() { return this.uniBody.tts; }
  set tts(v: string) { this.synced = false; this.uniBody.tts = v; }

  get endSession() { return this.uniBody.endSession; }
  set endSession(v: boolean) { this.synced = false; this.uniBody.endSession = v; }

  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }

  sync() {
    this.syncBubbles();
    this.syncSuggest();
    this.syncTts();
    this.syncEndSession();
  }

  protected abstract init(): TBody;
  protected abstract syncBubbles(): void;
  protected abstract syncSuggest(): void;
  protected abstract syncTts(): void;
  protected abstract syncEndSession(): void;
}
