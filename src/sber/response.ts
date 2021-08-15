/**
 * Sber response.
 */
import { NLPResponseATU } from '@salutejs/types';
import { BaseResponse } from '../base/response';
import { IResponse } from '../types/response';
import { getImageItem } from './image';
import { SberRequest } from './request';

// todo: support other messageNames, not only NLPResponseATU

// Use fake Omit to have 'SberResBody' in ts messages.
type SberResBody = Omit<NLPResponseATU, ''>;

export class SberResponse extends BaseResponse<SberResBody, SberRequest> implements IResponse<SberResBody> {
  isSber(): this is SberResponse { return true; }

  protected syncBubbles() {
    const { items } = this.platformBody.payload;
    items.length = 0;
    for (const bubble of this.bubbles) {
      if (typeof bubble === 'string') {
        items.push({ bubble: { text: bubble }});
      } else if ('imageId' in bubble) {
        items.push(getImageItem(bubble));
      }
    }
  }

  protected syncSuggest() {
    this.body.payload.suggestions!.buttons = this.suggest.map(title => {
      return { title, action: { type: 'text', text: title }};
    });
  }

  protected syncTts() {
    this.platformBody.payload.pronounceText = this.tts;
  }

  protected syncEndSession() {
    this.platformBody.payload.finished = this.endSession;
  }

  protected init(): SberResBody {
    this.isMale = this.request.body.payload.character.gender === 'male';
    this.isOfficial = this.request.body.payload.character.appeal === 'official';
    return {
      messageName: 'ANSWER_TO_USER',
      sessionId: this.request.sessionId,
      messageId: this.request.messageId,
      uuid: this.request.body.uuid,
      payload: {
        pronounceText: '',
        pronounceTextType: 'application/ssml',
        projectName: this.request.body.payload.projectName,
        intent: '',
        device: this.request.body.payload.device,
        items: [],
        suggestions: { buttons: [] },
        auto_listening: true,
        finished: false,
      }
    };
  }
}
