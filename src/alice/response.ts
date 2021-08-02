/**
 * Alice response.
 */
import { ResBody } from 'alice-types';
import { BaseResponse, IResponse } from '../base/response';

export class AliceResponse extends BaseResponse implements IResponse {
  body: ResBody;

  isAlice(): this is AliceResponse {
    return true;
  }

  constructor() {
    super();
    this.body = this.initBody();
  }

  get data() {
    return this.body.response;
  }

  set data(value: ResBody['response']) {
    this.body.response = value;
  }

  get userState() {
    return this.body.user_state_update;
  }

  set userState(value: ResBody['user_state_update']) {
    this.body.user_state_update = value;
  }

  get applicationState() {
    return this.body.application_state;
  }

  set applicationState(value: ResBody['application_state']) {
    this.body.application_state = value;
  }

  get sessionState() {
    return this.body.session_state;
  }

  set sessionState(value: ResBody['session_state']) {
    this.body.session_state = value;
  }

  private initBody(): ResBody {
    return {
      response: { text: '', end_session: false },
      version: '1.0'
    };
  }
}
