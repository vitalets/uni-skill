/**
 * Sber response.
 */
import { NLPResponseATU } from '@salutejs/types';
import { BaseResponse, IResponse } from '../base/response';
import { SberRequest } from './request';

// todo: support other types
type ResBody = NLPResponseATU;

export class SberResponse extends BaseResponse implements IResponse {
  body: ResBody;

  isSber(): this is SberResponse {
    return true;
  }

  constructor(request: SberRequest) {
    super();
    this.body = this.initBody(request);
  }

  get data() {
    // todo:
    return this.body.payload;
  }

  set data(value: ResBody['payload']) {
    this.body.payload = value;
  }

  private initBody(request: SberRequest): ResBody {
    return {
      messageName: 'ANSWER_TO_USER',
      sessionId: request.sessionId,
      messageId: request.messageId,
      uuid: request.body.uuid,
      payload: {
        pronounceText: '',
        projectName: request.body.payload.projectName,
        intent: request.isMessageToSkill() ? request.body.payload.intent : '',
        device: request.body.payload.device,
        items: [],
        auto_listening: true,
        finished: false,
      }
    };
  }
}
