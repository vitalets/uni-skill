/**
 * Alice response.
 */
import { ResBody } from 'alice-types';
import { BaseResponse } from '../base/response';
import { ImageBubble, IResponse } from '../types/response';
import { AliceRequest } from './request';

// Use fake Omit to have 'AliceResBody' in ts messages.
type AliceResBody = Omit<ResBody, ''>;

export class AliceResponse extends BaseResponse<AliceResBody, AliceRequest> implements IResponse<AliceResBody> {
  isAlice(): this is AliceResponse { return true; }

  protected syncBubbles() {
    const { response } = this.platformBody;
    const texts: string[] = [];
    for (const bubble of this.bubbles) {
      if (typeof bubble === 'string') {
        texts.push(bubble);
      } else if ('imageId' in bubble) {
        this.syncImage(texts, bubble);
      }
    }
    response.text = texts.join('\n');
  }

  protected syncSuggest() {
    this.platformBody.response.buttons = this.suggest.map(title => ({ title, hide: true }));
  }

  protected syncTts() {
    this.platformBody.response.tts = this.tts;
  }

  protected syncEndSession() {
    this.platformBody.response.end_session = this.endSession;
  }

  get userState() { return this.body.user_state_update; }
  set userState(value: AliceResBody['user_state_update']) { this.body.user_state_update = value; }

  get applicationState() { return this.body.application_state; }
  set applicationState(value: AliceResBody['application_state']) { this.body.application_state = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: AliceResBody['session_state']) { this.body.session_state = value; }

  protected init(): AliceResBody {
    return {
      response: {
        text: '',
        buttons: [],
        end_session: false
      },
      version: '1.0'
    };
  }

  private syncImage(texts: string[], { imageId, title, description }: ImageBubble) {
    const { response } = this.platformBody;
    response.card = { type: 'BigImage', image_id: imageId, title, description };
    // дописываем все в text, т.к. он не может быть пустым
    if (title) texts.push(title);
    if (description) texts.push(description);
  }
}
