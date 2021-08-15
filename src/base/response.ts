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
const syncedProps = [
  'bubbles',
  'tts',
  'suggest',
  'endSession',
];

export abstract class BaseResponse<TBody, TReq> {
  protected platformBody: TBody;
  protected request: TReq;
  protected synced = true;

  bubbles: Bubble[] = [];
  suggest: string[] = [];
  tts = '';
  endSession = false;
  isMale = false;
  isOfficial = true;

  constructor(request: TReq) {
    this.request = request;
    this.platformBody = this.init();
    this.sync();
    return this.asProxy();
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

  private asProxy() {
    const updateSyncedFlag = (prop: string | symbol) => {
      if (typeof prop === 'string' && syncedProps.includes(prop)) this.synced = false;
    };
    return new Proxy(this, {
      get: (obj, prop) => {
        updateSyncedFlag(prop);
        // @ts-expect-error any
        return obj[prop];
      },
      set: (obj, prop, value) => {
        updateSyncedFlag(prop);
        // @ts-expect-error any
        obj[prop] = value;
        return true;
      },
    });
  }
}
