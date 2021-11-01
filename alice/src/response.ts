/**
 * Alice response.
 */
import { ResBody } from 'alice-types';
import {
  IResponse,
  BaseResponse,
  Image,
  State,
  Link,
  concatWithNewline,
  concatWithSpace,
} from '@uni-skill/core';
import { AliceRequest } from './request';
import { convertSsmlForAlice } from './ssml';
import { addLinksToCard, addLinksToTextBubble } from './links';

// Use fake Omit to have 'AliceResBody' in ts messages.
type AliceResBody = Omit<ResBody, ''>;

export class AliceResponse
extends BaseResponse<AliceResBody, AliceRequest>
implements IResponse<AliceResBody, AliceRequest> {
  isAlice(): this is AliceResponse { return true; }
  assistantName = 'Алиса';

  /** В Алисе возможен только 1 бабл с текстом, поэтому отбиваем переносом строки */
  protected addTextInternal(text: string) {
    const { response } = this.body;
    const { card } = response;
    if (card?.type === 'BigImage') {
      card.description = concatWithNewline(card.description, text);
    } else if (card) {
      throw new Error(`Can not add text to card.type: ${card.type}`);
    }
    response.text = concatWithNewline(response.text, text);
  }

  /** В Алисе возможна только 1 картинка */
  protected addImageInternal({ imageId, title, description }: Image) {
    const { response } = this.body;
    response.card = {
      type: 'BigImage',
      image_id: imageId,
      title,
      description: concatWithNewline(response.text, description),
    };
    // always append title and description to text
    // as it can't be empty in Alice (used for non-image devices)
    if (title) response.text = concatWithNewline(response.text, title);
    if (description) response.text = concatWithNewline(response.text, description);
  }

  protected addVoiceInternal(ssml: string) {
    const { response } = this.body;
    ssml = convertSsmlForAlice(ssml);
    response.tts = concatWithSpace(response.tts, ssml);
  }

  protected addSuggestInternal(suggest: string[]) {
    this.body.response.buttons!.push(
      ...suggest.map(title => ({ title, hide: true }))
    );
  }

  protected addLinksInternal(links: Link[]) {
    const { card } = this.body.response;
    if (card?.type === 'BigImage') {
      addLinksToCard(links, card);
    } else {
      addLinksToTextBubble(links, this.body.response.buttons!);
    }
  }

  protected endSessionInternal(value: boolean) {
    this.body.response.end_session = value;
  }

  /** Для userState используем дополнительный ключ data, чтобы легче было сбрасывать стейт */
  get userState() { return this.body.user_state_update?.data as State; }
  set userState(data: State) { this.body.user_state_update = { data }; }

  get applicationState() { return this.body.application_state; }
  set applicationState(value: State) { this.body.application_state = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: State) { this.body.session_state = value; }

  protected init(): AliceResBody {
    return {
      response: {
        text: '',
        tts: '',
        buttons: [],
        end_session: false
      },
      version: '1.0'
    };
  }
}
