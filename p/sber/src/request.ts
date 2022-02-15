/**
 * Sber request.
 */
import { NLPRequest, NLPRequestMTS, NLPRequestСA, NLPRequestRA, NLPRequestSA } from '@salutejs/types';
import { UniRequest, BaseRequest, Platform } from '@uni-skill/core';
import { SberResponse } from './response';

// Use fake Omit to have 'SberReqBody' in ts messages.
type SberReqBody = Omit<NLPRequest, ''>;

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
    if (this.isMessageToSkill() || this.isEndSession()) {
      const { asr_normalized_message, original_text } = this.body.payload.message;
      // Изначально берем asr_normalized_message, т.к. там нормализованы числительные.
      // Это ближе к другим платформам. Но при тапе в саджест там null, поэтому используем original_text.
      // See: https://developers.sber.ru/docs/ru/salute/api/smartapp_api_requests#message-to-skill
      return asr_normalized_message || original_text;
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
    // Раньше тут была проверка на this.isMessageToSkill() || this.isRunApp(),
    // но тайпинги для RUN_APP не содержат payload.meta, хотя он приходит.
    // Поэтому убрал тайпгарды.
    // Note: даже в MESSAGE_TO_SKILL иногда таймзона отсутствует
    // @ts-expect-error safe get timezone
    return this.body.payload?.meta?.time?.timezone_id || '';
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
