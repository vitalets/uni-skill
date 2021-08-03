/**
 * Alice request.
 */
import { ReqBody } from 'alice-types';
import { BaseRequest, IRequest } from '../base/request';

export class AliceRequest extends BaseRequest implements IRequest<ReqBody> {
  static match(reqBody: unknown): reqBody is ReqBody {
    return Boolean((reqBody as ReqBody)?.request);
  }

  isAlice(): this is AliceRequest { return true; }
  constructor(public body: ReqBody) { super(); }
  get userId() { return this.body.session.application.application_id; }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  get userMessage() { return this.body.request.command || ''; }
  get isNewSession() { return this.body.session.new; }
  get hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  get userState() { return this.body.state?.user; }
  get applicationState() { return this.body.state?.application; }
  get sessionState() { return this.body.state?.session; }
}
