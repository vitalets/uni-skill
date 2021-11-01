/**
 * Alice request.
 */
import { ReqBody } from 'alice-types';
import { IRequest, BaseRequest, State } from '@uni-skill/core';
import { AliceResponse } from './response';

// Use fake Omit to have 'AliceReqBody' in ts messages.
type AliceReqBody = Omit<ReqBody, ''>;

export class AliceRequest
extends BaseRequest<AliceReqBody, AliceResponse>
implements IRequest<AliceReqBody, AliceResponse> {
  static create(reqBody: unknown) {
    const body = reqBody as AliceReqBody;
    if (body?.session?.skill_id) {
      return new AliceRequest(body);
    }
  }
  createResponse() { return new AliceResponse(this); }
  isAlice(): this is AliceRequest { return true; }
  get userId() {
    const { user, application } = this.body.session;
    return user?.user_id || application?.application_id || '';
  }
  get sessionId() { return this.body.session.session_id; }
  get messageId() { return this.body.session.message_id; }
  get userMessage() { return this.body.request.command || this.body.request.original_utterance || ''; }
  get clientInfo() { return this.body.meta.client_id; }
  get isNewSession() { return this.body.session.new; }
  get hasScreen() { return Boolean(this.body.meta.interfaces.screen); }
  get isAuthorized() { return Boolean(this.body.session.user); }
  isCloseApp() { return false; }

  getIntent(name: string) {
    const aliceIntent = this.body.request.nlu?.intents?.[name];
    // todo: extract slots
    if (aliceIntent) return { name, slots: {}};
  }

  /** own */

  /** Для userState используем дополнительный ключ data, чтобы легче было сбрасывать стейт */
  get userState() { return this.body.state?.user?.data as State; }
  get applicationState() { return this.body.state?.application; }
  get sessionState() { return this.body.state?.session; }
}

