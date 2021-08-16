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

  protected addTextInternal(text: string) {
    this.body.response.text = [ this.body.response.text, text ]
      .filter(text => typeof text === 'string' && text.length > 0)
      .join('\n');
  }

  protected addImageInternal({ imageId, title, description }: ImageBubble) {
    this.body.response.card = { type: 'BigImage', image_id: imageId, title, description };
    // дописываем все в text, т.к. в Алисе он не может быть пустым
    if (title) this.addTextInternal(title);
    if (description) this.addTextInternal(description);
  }

  protected setVoiceInternal(text: string) {
    this.body.response.tts = text;
  }

  protected addSuggestInternal(suggest: string[]) {
    this.body.response.buttons = suggest.map(title => ({ title, hide: true }));
  }

  protected endSessionInternal(value: boolean) {
    this.body.response.end_session = value;
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
        tts: '',
        buttons: [],
        end_session: false
      },
      version: '1.0'
    };
  }
}
