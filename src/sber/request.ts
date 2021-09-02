/**
 * Sber request.
 */
import { NLPRequest, NLPRequestMTS, NLPRequestСA, NLPRequestRA, NLPRequestSA } from '@salutejs/types';
import { CommonRequest } from '../base/request';

// Use fake Omit to have 'SberReqBody' in ts messages.
type SberReqBody = Omit<NLPRequest, ''>;

export class SberRequest extends CommonRequest<SberReqBody> {
  static match(reqBody: unknown): reqBody is SberReqBody {
    return Boolean((reqBody as SberReqBody)?.messageName);
  }

  isSber(): this is SberRequest { return true; }
  get userId() { return this.body.uuid.sub || this.body.uuid.userId; }
  get sessionId() { return this.body.sessionId; }
  get messageId() { return this.body.messageId; }
  get userMessage(): string {
    return this.isMessageToSkill() || this.isCloseApp()
      ? (this.body.payload.message.original_text || '').toLocaleLowerCase()
      : '';
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
    return this.isMessageToSkill() || this.isCloseApp()
      ? this.body.payload.new_session
      : (this.isRunApp() ? true : false);
  }

  get hasScreen() {
    // meta.features.screen.enabled?
    return Boolean(this.body.payload.device.capabilities.screen?.available);
  }

  get isAuthorized() { return Boolean(this.body.uuid.sub); }

  isCloseApp(): this is this & { body: NLPRequestСA } {
    return this.body.messageName === 'CLOSE_APP';
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
