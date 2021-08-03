/**
 * Sber response.
 */
import { NLPResponseATU, BubbleCommand } from '@salutejs/types';
import { BaseResponse, IResponse } from '../base/response';
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

  get tts() { return this.body.payload.pronounceText || ''; }
  set tts(value: string) { this.body.payload.pronounceText = value; }

  get text() { return this.getOrCreateTextBubble().bubble.text; }
  set text(value: string) {
    // todo: several bubbles?
    // todo: check for max length 250
    this.getOrCreateTextBubble().bubble.text = value;
  }

  get endSession() { return this.body.payload.finished; }
  set endSession(value: boolean) { this.body.payload.finished = value; }

  addButtons(titles: string[]) {
    for (const title of titles) {
      this.body.payload.suggestions!.buttons.push({
        title,
        action: { type: 'text', text: title }
      });
    }
  }

  private initBody(request: SberRequest) {
    const resBody: SberResBody = {
      messageName: 'ANSWER_TO_USER',
      sessionId: request.sessionId,
      messageId: request.messageId,
      uuid: request.body.uuid,
      payload: {
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

  // see: https://developer.sberdevices.ru/docs/ru/developer_tools/amp/smartapp_interface_elements#bubble
  private getOrCreateTextBubble() {
    let textBubble = this.body.payload.items.find(item => Boolean(item.bubble));
    if (!textBubble) {
      textBubble = { bubble: { text: '' }};
      this.body.payload.items.push(textBubble);
    }
    return textBubble as BubbleCommand;
  }
}
