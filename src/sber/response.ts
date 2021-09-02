/**
 * Sber response.
 */
import { NLPResponseATU } from '@salutejs/types';
import { CommonResponse } from '../base/response';
import { ImageBubble, Link } from '../base/types';
import { getImageItem } from './image';
import { getLinkItem } from './link';
import { SberRequest } from './request';

// todo: support other messageNames, not only NLPResponseATU

// Use fake Omit to have 'SberResBody' in ts messages.
type SberResBody = Omit<NLPResponseATU, ''>;

export class SberResponse extends CommonResponse<SberResBody, SberRequest> {
  isSber(): this is SberResponse { return true; }

  protected addTextInternal(text: string) {
    this.body.payload.items.push({ bubble: { text }});
  }

  protected addImageInternal(image: ImageBubble) {
    this.body.payload.items.push(getImageItem(image));
  }

  protected setVoiceInternal(text: string) {
    this.body.payload.pronounceText = text;
  }

  protected addSuggestInternal(suggest: string[]) {
    this.body.payload.suggestions!.buttons = suggest.map(title => {
      return { title, action: { type: 'text', text: title }};
    });
  }

  protected addLinkInternal(link: Link) {
    this.body.payload.items.push(getLinkItem(link));
  }

  protected endSessionInternal(value: boolean) {
    this.body.payload.finished = value;
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
