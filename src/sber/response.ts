/**
 * Sber response.
 */
import { NLPResponseATU } from '@salutejs/types';
import { BaseResponse, IResponse, ResponseImage } from '../base/response';
import { getImageItem } from './image';
import { SberRequest } from './request';

// todo: support other messageNames, not only NLPResponseATU

// Use fake Omit to have 'SberResBody' in ts messages.
type SberResBody = Omit<NLPResponseATU, ''>;

export class SberResponse extends BaseResponse implements IResponse<SberResBody> {
  body: SberResBody;

  isSber(): this is SberResponse { return true; }

  constructor(request: SberRequest) {
    super();
    this.body = this.initBody(request);
  }

  get endSession() { return this.body.payload.finished; }
  set endSession(value: boolean) { this.body.payload.finished = value; }

  addText(text: string) {
    this.body.payload.items.push({
      bubble: { text }
    });
  }

  addTts(value: string) {
    const { pronounceText } = this.body.payload;
    this.body.payload.pronounceText = pronounceText
      ? `${pronounceText} ${value}`
      : value;
  }

  addSuggest(titles: string[]) {
    for (const title of titles) {
      this.body.payload.suggestions!.buttons.push({
        title,
        action: { type: 'text', text: title }
      });
    }
  }

  addImage(image: ResponseImage) {
    const imageItem = getImageItem(image);
    this.body.payload.items.push(imageItem);
  }

  private initBody(request: SberRequest) {
    const resBody: SberResBody = {
      messageName: 'ANSWER_TO_USER',
      sessionId: request.sessionId,
      messageId: request.messageId,
      uuid: request.body.uuid,
      payload: {
        pronounceTextType: 'application/ssml',
        projectName: request.body.payload.projectName,
        intent: '',
        device: request.body.payload.device,
        items: [],
        suggestions: { buttons: [] },
        auto_listening: true,
        finished: false,
      }
    };
    return resBody;
  }
}
