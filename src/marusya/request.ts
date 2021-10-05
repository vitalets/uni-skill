/**
 * Marusya request.
 */
import { ReqBody } from 'marusya-types';
import { CommonRequest } from '../common/request';
import { State } from '../common/types';

// Use fake Omit to have 'MarusyaReqBody' in ts messages.
type MarusyaReqBody = Omit<ReqBody, ''>;

const MARUSYA_APP_TYPES = [ 'mobile', 'speaker', 'vk', 'other', 'web' ];

export class MarusyaRequest extends CommonRequest<MarusyaReqBody> {
  static match(reqBody: unknown): reqBody is MarusyaReqBody {
    const appType = (reqBody as MarusyaReqBody)?.session?.application?.application_type;
    // undocumented field, but seems to exist in all Marusya reqs
    const cityId = (reqBody as MarusyaReqBody)?.meta?._city_ru;
    return Boolean(cityId) || Boolean(appType) && MARUSYA_APP_TYPES.includes(appType.toLowerCase());
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
  getIntent(_: string) { return undefined; }

  /** own */

  /** Для userState используем дополнительный ключ data, чтобы легче было сбрасывать стейт */
  get userState() { return this.body.state?.user?.data as State; }
  get sessionState() { return this.body.state?.session; }
}
