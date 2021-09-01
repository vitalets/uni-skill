/**
 * Marusya request.
 */
import { ReqBody } from 'marusya-types';
import { BaseRequest } from '../base/request';
import { IRequest } from '../types/request';
import { State } from '../types/response';

// Use fake Omit to have 'MarusyaReqBody' in ts messages.
type MarusyaReqBody = Omit<ReqBody, ''>;

const MARUSYA_APP_TYPES = [ 'mobile', 'speaker', 'VK', 'other' ];

export class MarusyaRequest extends BaseRequest<MarusyaReqBody> implements IRequest<MarusyaReqBody> {
  static match(reqBody: unknown): reqBody is MarusyaReqBody {
    const appType = (reqBody as MarusyaReqBody)?.session?.application?.application_type;
    return Boolean(appType) && MARUSYA_APP_TYPES.includes(appType);
  }
  isMarusya(): this is MarusyaRequest { return true; }
  get userId() {
    const { user, application } = this.body.session;
    return user?.user_id || application?.application_id || '';
  }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  get userMessage() {
    const { command, original_utterance } = this.body.request;
    const msg = this.isCloseApp() ? original_utterance : ( command || original_utterance);
    return msg || '';
  }
  get clientInfo() {
    return `${this.body.meta.client_id}; app: ${this.body.session.application.application_type}`;
  }
  get isNewSession() { return this.body.session.new; }
  get hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  get isAuthorized() { return Boolean(this.body.session.user); }
  isCloseApp() { return this.body.request.command === 'on_interrupt'; }

  /** own */

  /** Для userState используем дополнительный ключ data, чтобы легче было сбрасывать стейт */
  get userState() { return this.body.state?.user?.data as State; }
  get sessionState() { return this.body.state?.session; }
}
