/**
 * Marusya request.
 */
import { ReqBody } from 'marusya-types';
import { UniRequest, BaseRequest, State, Platform } from '@uni-skill/core';
import { MarusyaResponse } from './response';

// Use fake Omit to have 'MarusyaReqBody' in ts messages.
type MarusyaReqBody = Omit<ReqBody, ''>;

const MARUSYA_APP_TYPES = [ 'mobile', 'speaker', 'vk', 'other', 'web' ];

export class MarusyaRequest
extends BaseRequest<MarusyaReqBody, MarusyaResponse>
implements UniRequest<MarusyaReqBody, MarusyaResponse> {
  static create(reqBody: unknown) {
    const body = reqBody as MarusyaReqBody;
    const appType = body?.session?.application?.application_type?.toLowerCase();
    // undocumented field, but seems to exist in all Marusya reqs
    const cityId = body?.meta?._city_ru;
    if (cityId || MARUSYA_APP_TYPES.includes(appType)) {
      return new MarusyaRequest(body);
    }
  }
  createResponse() { return new MarusyaResponse(this); }
  isMarusya(): this is MarusyaRequest { return true; }
  isPing() { return Boolean(this.body.meta?.test); }
  platform: Platform = 'marusya';
  get userId() {
    const { user, application } = this.body.session;
    return user?.user_id || application?.application_id || '';
  }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  protected get platformUserMessage() {
    const { command, original_utterance } = this.body.request;
    // при endSession в command 'on_interrupt'
    return this.isEndSession()
      ? original_utterance
      : (command || original_utterance);
  }
  get clientInfo() {
    return `${this.body.meta.client_id}; app: ${this.body.session.application.application_type}`;
  }
  get isNewSession() { return this.body.session.new; }
  get hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  get isAuthorized() { return Boolean(this.body.session.user); }
  isEndSession() { return this.body.request.command === 'on_interrupt'; }
  getTimezone() { return this.body.meta.timezone || ''; }
  getIntent(_: string) { return undefined; }

  /** own */

  /** Для userState используем дополнительный ключ data, чтобы легче было сбрасывать стейт */
  get userState() { return this.body.state?.user?.data as State; }
  get sessionState() { return this.body.state?.session; }
}
