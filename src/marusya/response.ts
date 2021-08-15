/**
 * Marusya response.
 */
import { ResBody } from 'marusya-types';
import { BaseResponse } from '../base/response';
import { ImageBubble, IResponse } from '../types/response';
import { MarusyaRequest } from './request';

// Use fake Omit to have 'MarusyaResBody' in ts messages.
type MarusyaResBody = Omit<ResBody, ''>;

export class MarusyaResponse extends BaseResponse<MarusyaResBody, MarusyaRequest> implements IResponse<MarusyaResBody> {
  isMarusya(): this is MarusyaResponse { return true; }

  get userState() { return this.platformBody.user_state_update; }
  set userState(value: MarusyaResBody['user_state_update']) { this.platformBody.user_state_update = value; }

  get sessionState() { return this.platformBody.session_state; }
  set sessionState(value: MarusyaResBody['session_state']) { this.platformBody.session_state = value; }

  protected syncBubbles() {
    const { response } = this.platformBody;
    response.text = [];
    for (const bubble of this.bubbles) {
      if (typeof bubble === 'string') {
        response.text.push(bubble);
      } else if ('imageId' in bubble) {
        this.syncImage(bubble);
      }
    }
  }

  protected syncSuggest() {
    this.platformBody.response.buttons = this.suggest.map(title => ({ title }));
  }

  protected syncTts() {
    this.platformBody.response.tts = this.tts;
  }

  protected syncEndSession() {
    this.platformBody.response.end_session = this.endSession;
  }

  protected init(): MarusyaResBody {
    return {
      response: { text: [], buttons: [], end_session: false },
      session: this.request.body.session,
      version: '1.0'
    };
  }

  private syncImage({ imageId, title, description }: ImageBubble) {
    const { response } = this.platformBody;
    response.card = {
      type: 'BigImage',
      image_id: Number(imageId),
    };
    if (title) (response.text as string[]).push(title);
    if (description) (response.text as string[]).push(description);
  }
}
