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

  get userId() { return this.body.uuid.userId || this.body.uuid.sub; }
  get sessionId() { return this.body.sessionId; }
  get messageId() { return this.body.messageId; }
  get userMessage(): string {
    return this.isMessageToSkill() || this.isCloseApp()
      ? (this.body.payload.message.original_text || '').toLocaleLowerCase()
      : '';
  }

  get isNewSession(): boolean {
    return this.isMessageToSkill() || this.isCloseApp()
      ? this.body.payload.new_session
      : (this.isRunApp() ? true : false);

  }

  get hasScreen() {
    return Boolean(this.body.payload.device.capabilities.screen?.available);
  }

  isMessageToSkill(): this is { body: NLPRequestMTS } {
    return this.body.messageName === 'MESSAGE_TO_SKILL';
  }

  isCloseApp(): this is { body: NLPRequestСA } {
    return this.body.messageName === 'CLOSE_APP';
  }

  isServerAction(): this is { body: NLPRequestSA } {
    return this.body.messageName === 'SERVER_ACTION';
  }

  isRunApp(): this is { body: NLPRequestRA } {
    return this.body.messageName === 'RUN_APP';
  }
}
