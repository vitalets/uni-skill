/**
 * Marusya response.
 */
import { ResBody } from 'marusya-types';
import { BaseResponse, IResponse } from '../base/response';
import { MarusyaRequest } from './request';

export class MarusyaResponse extends BaseResponse implements IResponse {
  body: ResBody;

  isMarusya(): this is MarusyaResponse {
    return true;
  }

  constructor(request: MarusyaRequest) {
    super();
    this.body = this.initBody(request);
  }

  get data() { return this.body.response; }
  set data(value: ResBody['response']) { this.body.response = value; }

  get endSession() { return this.body.response.end_session; }
  set endSession(value: boolean) { this.body.response.end_session = value; }

  get userState() { return this.body.user_state_update; }
  set userState(value: ResBody['user_state_update']) { this.body.user_state_update = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: ResBody['session_state']) { this.body.session_state = value; }

  private initBody(request: MarusyaRequest): ResBody {
    return {
      response: { text: '', end_session: false },
      session: request.body.session,
      version: '1.0'
    };
  }
}
