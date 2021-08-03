/**
 * Marusya request.
 */
import { ReqBody } from 'marusya-types';
import { BaseRequest, IRequest } from '../base/request';

export class MarusyaRequest extends BaseRequest implements IRequest<ReqBody> {
  static match(reqBody: unknown): reqBody is ReqBody {
    return Boolean((reqBody as ReqBody)?.session?.auth_token);
  }
  isMarusya(): this is MarusyaRequest { return true; }
  constructor(public body: ReqBody) { super(); }
  get userId() { return this.body.session.application.application_id; }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  get userMessage() { return this.body.request.command || ''; }
  get isNewSession() { return this.body.session.new; }
  get hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  get userState() { return this.body.state?.user; }
  get sessionState() { return this.body.state?.session; }
}
