/**
 * Alice response.
 */
import { ResBody } from 'alice-types';
import { BaseResponse, IResponse } from '../base/response';

export class AliceResponse extends BaseResponse implements IResponse<ResBody> {
  body: ResBody;
  isAlice(): this is AliceResponse { return true; }

  constructor() {
    super();
    this.body = this.initBody();
  }

  get tts() { return this.body.response.tts || ''; }
  set tts(value: string) { this.body.response.tts = value; }

  get text() { return this.body.response.text; }
  set text(value: string) { this.body.response.text = value; }

  get endSession() { return this.body.response.end_session; }
  set endSession(value: boolean) { this.body.response.end_session = value; }

  get userState() { return this.body.user_state_update; }
  set userState(value: ResBody['user_state_update']) { this.body.user_state_update = value; }

  get applicationState() { return this.body.application_state; }
  set applicationState(value: ResBody['application_state']) { this.body.application_state = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: ResBody['session_state']) { this.body.session_state = value; }

  addButtons(titles: string[]) {
    for (const title of titles) {
      this.body.response.buttons!.push({ title, hide: true });
    }
  }

  private initBody(): ResBody {
    return {
      response: { text: '', buttons: [], end_session: false },
      version: '1.0'
    };
  }
}
