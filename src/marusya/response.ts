/**
 * Marusya response.
 */
import { ResBody as AliceResBody } from 'alice-types';
import { BaseResponse, IResponse } from '../base/response';
import { MarusyaRequest } from './request';

// todo: write own types for marusya
type MarusyaResBody = AliceResBody & {
  session: MarusyaRequest['body']['session']
};

export class MarusyaResponse extends BaseResponse implements IResponse {
  body: MarusyaResBody;

  isMarusya(): this is MarusyaResponse {
    return true;
  }

  constructor(request: MarusyaRequest) {
    super();
    this.body = this.initBody(request);
  }

  get data() {
    return this.body.response;
  }

  set data(value: MarusyaResBody['response']) {
    this.body.response = value;
  }

  get userState() {
    return this.body.user_state_update;
  }

  set userState(value: MarusyaResBody['user_state_update']) {
    this.body.user_state_update = value;
  }

  get sessionState() {
    return this.body.session_state;
  }

  set sessionState(value: MarusyaResBody['session_state']) {
    this.body.session_state = value;
  }

  private initBody(request: MarusyaRequest): MarusyaResBody {
    return {
      response: { text: '', end_session: false },
      session: request.body.session,
      version: '1.0'
    };
  }
}
