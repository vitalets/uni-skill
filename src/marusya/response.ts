/**
 * Marusya response.
 */
import { ResBody } from 'marusya-types';
import { BaseResponse, IResponse } from '../base/response';
import { MarusyaRequest } from './request';

// Use fake Omit to have 'MarusyaResBody' in ts messages.
type MarusyaResBody = Omit<ResBody, ''>;

export class MarusyaResponse extends BaseResponse implements IResponse<MarusyaResBody> {
  body: MarusyaResBody;
  isMarusya(): this is MarusyaResponse { return true; }

  constructor(request: MarusyaRequest) {
    super();
    this.body = this.initBody(request);
  }

  get tts() { return this.body.response.tts || ''; }
  set tts(value: string) { this.body.response.tts = value; }

  get text() {
    const { text } = this.body.response;
    return Array.isArray(text) ? text[0] : text;
  }
  set text(value: string) { this.body.response.text = value; }

  get endSession() { return this.body.response.end_session; }
  set endSession(value: boolean) { this.body.response.end_session = value; }

  get userState() { return this.body.user_state_update; }
  set userState(value: MarusyaResBody['user_state_update']) { this.body.user_state_update = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: MarusyaResBody['session_state']) { this.body.session_state = value; }

  addButtons(titles: string[]) {
    for (const title of titles) {
      this.body.response.buttons!.push({ title });
    }
  }

  private initBody(request: MarusyaRequest): MarusyaResBody {
    return {
      response: { text: '', buttons: [], end_session: false },
      session: request.body.session,
      version: '1.0'
    };
  }
}
