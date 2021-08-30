/**
 * Alice response.
 */
import { ResBody } from 'alice-types';
import { BaseResponse } from '../base/response';
import { ImageBubble, IResponse, State } from '../types/response';
import { concatWithSeparator } from '../utils';
import { AliceRequest } from './request';

// Use fake Omit to have 'AliceResBody' in ts messages.
type AliceResBody = Omit<ResBody, ''>;

export class AliceResponse extends BaseResponse<AliceResBody, AliceRequest> implements IResponse<AliceResBody> {
  isAlice(): this is AliceResponse { return true; }

  protected addTextInternal(text: string) {
    // todo: если response.text есть и заканчивается буквой, а не знаком препинания, то нужно туда дописать точку.
    // Иначе все сольётся в одно предложение.
    this.body.response.text = concatWithSeparator(this.body.response.text, text, '\n');
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
