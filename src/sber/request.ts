/**
 * Sber request.
 */
import { NLPRequest, NLPRequestMTS, NLPRequestСA, NLPRequestRA, NLPRequestSA } from '@salutejs/types';
import { BaseRequest, IRequest } from '../base/request';

// Use fake Omit to have 'SberReqBody' in ts messages.
type SberReqBody = Omit<NLPRequest, ''>;

export class SberRequest extends BaseRequest implements IRequest<SberReqBody> {
  static match(reqBody: unknown): reqBody is SberReqBody {
    return Boolean((reqBody as SberReqBody)?.messageName);
  }

  isSber(): this is SberRequest { return true; }

  constructor(public body: SberReqBody) { super(); }

  get userId() { return this.body.uuid.sub || this.body.uuid.userId; }
  get sessionId() { return this.body.sessionId; }
  get messageId() { return this.body.messageId; }
  get userMessage(): string {
    return this.isMessageToSkill() || this.isCloseApp()
      ? (this.body.payload.message.original_text || '').toLocaleLowerCase()
      : '';
  }

  isNewSession() {
    return this.isMessageToSkill() || this.isCloseApp()
      ? this.body.payload.new_session
      : (this.isRunApp() ? true : false);
  }

  hasScreen() {
    return Boolean(this.body.payload.device.capabilities.screen?.available);
  }

  isAuthorized() { return Boolean(this.body.uuid.sub); }

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
