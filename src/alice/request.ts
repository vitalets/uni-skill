/**
 * Alice request.
 */
import { ReqBody } from 'alice-types';
import { BaseRequest } from '../base/request';
import { IRequest } from '../types/request';

// Use fake Omit to have 'AliceReqBody' in ts messages.
type AliceReqBody = Omit<ReqBody, ''>;

export class AliceRequest extends BaseRequest<AliceReqBody> implements IRequest<AliceReqBody> {
  static match(reqBody: unknown): reqBody is AliceReqBody {
    return Boolean((reqBody as AliceReqBody)?.request);
  }
  isAlice(): this is AliceRequest { return true; }
  get userId() { return this.body.session.application.application_id; }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  get userMessage() { return this.body.request.command || this.body.request.original_utterance || ''; }
  get clientInfo() { return this.body.meta.client_id; }
  get isNewSession() { return this.body.session.new; }
  get hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  get isAuthorized() { return Boolean(this.body.session.user); }
  isCloseApp() { return false; }

  /** own */

  get userState() { return this.body.state?.user; }
  get applicationState() { return this.body.state?.application; }
  get sessionState() { return this.body.state?.session; }
}
