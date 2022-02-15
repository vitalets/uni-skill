/**
 * Sber request.
 */
import { UniRequest, BaseRequest, Platform } from '@uni-skill/core';
import { SberResponse } from './response';
import { SberReqBody, NLPRequestMTS, NLPRequestСA, NLPRequestRA, NLPRequestSA } from './types';

export class SberRequest
extends BaseRequest<SberReqBody, SberResponse>
implements UniRequest<SberReqBody, SberResponse> {
  static create(reqBody: unknown) {
    const body = reqBody as SberReqBody;
    if (body?.messageName) {
      return new SberRequest(body);
    }
  }
  createResponse() { return new SberResponse(this); }
  isSber(): this is SberRequest { return true; }
  platform: Platform = 'sber';
  get userId() { return this.body.uuid.sub || this.body.uuid.userId; }
  get sessionId() { return this.body.sessionId; }
  get messageId() { return this.body.messageId; }
  protected get platformUserMessage(): string | void {
    // todo: кешировать результат?
    if (this.isMessageToSkill() || this.isEndSession()) {
      const { asr, message } = this.body.payload;
      // Раньше использовался message.asr_normalized_message т.к. там нормализованы числительные.
      // Отказался от него в пользу asr.hypotheses, т.к. там еще можно выбрать вариант без англ букв.
      // Рассматриваем только первые две гипотезы, т.к. дальше дичь
      const hypotheses = asr?.hypotheses || [];
      const hypoRu = hypotheses.slice(0, 2).find(h => !/[a-z]/i.test(h?.normalizedText));
      const asrText = hypoRu?.normalizedText || hypotheses[0]?.normalizedText;

      // Еще как вариант брать из tokenized_elements_list[].rawText.
      // Тогда например вместо "Переведи мне 100 €" получим "Переведи мне 100 евро"
      // Но пока некритично.

      // При тапе в саджест в asr пусто, поэтому используем original_text.
      // See: https://developers.sber.ru/docs/ru/salute/api/smartapp_api_requests#message-to-skill
      return asrText || message?.original_text;
    }
  }

  get clientInfo() {
    const { platformType, platformVersion, deviceModel, surface, surfaceVersion } = this.body.payload.device;
    return [
      `${platformType} ${platformVersion}`,
      `${deviceModel}`,
      `${surface} ${surfaceVersion}`,
    ].join('; ');
  }

  get isNewSession(): boolean {
    return this.isMessageToSkill() || this.isEndSession()
      ? this.body.payload.new_session
      : (this.isRunApp() ? true : false);
  }

  get hasScreen() {
    // meta.features.screen.enabled?
    return Boolean(this.body.payload.device.capabilities.screen?.available);
  }

  get isAuthorized() { return Boolean(this.body.uuid.sub); }

  isEndSession(): this is this & { body: NLPRequestСA } {
    return this.body.messageName === 'CLOSE_APP';
  }

  getTimezone() {
    // Note: даже в MESSAGE_TO_SKILL иногда таймзона отсутствует
    return this.isMessageToSkill() || this.isEndSession() || this.isRunApp()
      ? (this.body.payload?.meta?.time?.timezone_id || '')
      : '';
  }

  getIntent(name: string) {
    if (this.isMessageToSkill()) {
      return {
        name,
        slots: {}
      };
    }
  }

  /** own */

  isMessageToSkill(): this is this & { body: NLPRequestMTS } {
    return this.body.messageName === 'MESSAGE_TO_SKILL';
  }

  isServerAction(): this is this & { body: NLPRequestSA } {
    return this.body.messageName === 'SERVER_ACTION';
  }

  isRunApp(): this is this & { body: NLPRequestRA } {
    return this.body.messageName === 'RUN_APP';
  }
}
