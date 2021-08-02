/**
 * Sber request.
 */
import { NLPRequestMTS, NLPRequestСA } from '@salutejs/types';
import { BaseRequest, IRequest } from '../base/request';

// todo: support run-app and server-action
type ReqBody = NLPRequestMTS | NLPRequestСA;

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

  get userMessage() {
    return this.body.payload.message.asr_normalized_message || '';
  }

  get isNewSession() {
    return this.body.payload.new_session;
  }
}
