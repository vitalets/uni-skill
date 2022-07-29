/**
 * Sber response.
 */
import { Button, NLPResponseATU } from '@salutejs/scenario';
import {
  UniResponse,
  BaseResponse,
  Image,
  Link,
  concatWithSpace,
} from '@uni-skill/core';
import { SberRequest } from './request';
// import { getImageItem } from './image';
import { getImageItem } from './image-list-card';
import { getLinkItem } from './link';
import { convertSsmlForSber } from './ssml';
import { NLPResponseCR } from './rating';

// todo: support other messageNames

export type SberResBody = NLPResponseATU | NLPResponseCR;

export class SberResponse
extends BaseResponse<SberResBody, SberRequest>
implements UniResponse<SberResBody, SberRequest> {
  isSber(): this is SberResponse { return true; }

  constructor(request: SberRequest) {
    super(request);
    this.initCharacter();
  }

  protected platformAddText(text: string) {
    this.body.payload.items.push({ bubble: { text }});
  }

  protected platformAddImage(image: Image) {
    this.body.payload.items.push(getImageItem(image));
  }

  protected platformAddVoice(ssml: string) {
    const { payload } = this.body;
    ssml = convertSsmlForSber(ssml);
    payload.pronounceText = concatWithSpace(payload.pronounceText, ssml);
  }

  protected platformAddSuggest(suggest: string[]) {
    this.body.payload.suggestions!.buttons.push(
      ...suggest.map((title): Button => {
        return { title, action: { type: 'text', text: title }};
      })
    );
  }

  protected platformAddLinks(links: Link[]) {
    const { platformType } = this.body.payload.device!;
    for (const link of links) {
      this.body.payload.items.push(getLinkItem(link, platformType));
    }
  }

  protected platformEndSession(value: boolean) {
    this.body.payload.finished = value;
    // на всякий случай в Сбере еще auto_listening отключаем, т.к. не везде закрытие отрабатывает
    if (value) this.body.payload.auto_listening = false;
  }

  protected initBody(): SberResBody {
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

  private initCharacter() {
    const { gender, appeal, name } = this.request.body.payload.character;
    this.isMale = gender === 'male';
    this.isOfficial = appeal === 'official';
    this.assistantName = name;
  }
}
