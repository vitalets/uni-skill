/**
 * Sber request.
 */
import { NLPRequest, NLPRequestMTS, NLPRequestСA, NLPRequestRA, NLPRequestSA } from '@salutejs/types';
import { BaseRequest, IRequest } from '../base/request';

type ReqBody = NLPRequest;

export class SberRequest extends BaseRequest implements IRequest {
  static match(reqBody: unknown): reqBody is ReqBody {
    return Boolean((reqBody as ReqBody)?.messageName);
  }

  isSber(): this is SberRequest {
    return true;
  }

  constructor(public body: ReqBody) {
    super();
  }

  get userId() {
    return this.body.uuid.userId || this.body.uuid.sub;
  }

  get sessionId() {
    return this.body.sessionId;
  }

  get messageId() {
    return this.body.messageId;
  }

  get userMessage(): string {
    return this.isMessageToSkill() || this.isCloseApp()
      ? this.body.payload.message.asr_normalized_message || ''
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
