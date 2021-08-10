/**
 * Alice request.
 */
import { ReqBody } from 'alice-types';
import { BaseRequest, IRequest } from '../base/request';

// Use fake Omit to have 'AliceReqBody' in ts messages.
type AliceReqBody = Omit<ReqBody, ''>;

export class AliceRequest extends BaseRequest implements IRequest<AliceReqBody> {
  static match(reqBody: unknown): reqBody is AliceReqBody {
    return Boolean((reqBody as AliceReqBody)?.request);
  }

  isAlice(): this is AliceRequest { return true; }
  constructor(public body: AliceReqBody) { super(); }
  get userId() { return this.body.session.application.application_id; }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  get userMessage() { return this.body.request.command || this.body.request.original_utterance || ''; }
  isNewSession() { return this.body.session.new; }
  hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  isAuthorized() { return Boolean(this.body.session.user); }
  isCloseApp() { return false; }

  /** own */

  get userState() { return this.body.state?.user; }
  get applicationState() { return this.body.state?.application; }
  get sessionState() { return this.body.state?.session; }
}
