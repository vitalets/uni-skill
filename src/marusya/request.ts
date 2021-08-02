/**
 * Marusya request.
 */
import { ReqBody as AliceReqBody } from 'alice-types';
import { BaseRequest, IRequest } from '../base/request';

// todo: write own types for marusya
interface MarusyaReqBody extends AliceReqBody {
  session: AliceReqBody['session'] & {
    auth_token: string;
  }
}

export class MarusyaRequest extends BaseRequest implements IRequest {
  static match(reqBody: unknown): reqBody is MarusyaReqBody {
    return Boolean((reqBody as MarusyaReqBody)?.session?.auth_token);
  }

  isMarusya(): this is MarusyaRequest {
    return true;
  }

  constructor(public body: MarusyaReqBody) {
    super();
  }

  get userId() {
    return this.body.session.application.application_id;
  }

  get sessionId() {
    return this.body.session.session_id;
  }

  get messageId() {
    return this.body.session.message_id;
  }

  get userMessage() {
    return this.body.request.command || '';
  }

  get isNewSession() {
    return this.body.session.new;
  }

  get userState() {
    return this.body.state?.user;
  }

  get sessionState() {
    return this.body.state?.session;
  }
}
