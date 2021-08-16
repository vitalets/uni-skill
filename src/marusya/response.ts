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

  protected addTextInternal(text: string) {
    (this.body.response.text as string[]).push(text);
  }

  protected addImageInternal({ imageId, title, description }: ImageBubble) {
    this.body.response.card = {
      type: 'BigImage',
      image_id: Number(imageId),
    };
    if (title) this.addTextInternal(title);
    if (description) this.addTextInternal(description);
  }

  protected setVoiceInternal(text: string) {
    this.body.response.tts = text;
  }

  protected addSuggestInternal(suggest: string[]) {
    this.body.response.buttons = suggest.map(title => ({ title }));
  }

  protected endSessionInternal(value: boolean) {
    this.body.response.end_session = value;
  }

  get userState() { return this.body.user_state_update; }
  set userState(value: MarusyaResBody['user_state_update']) { this.body.user_state_update = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: MarusyaResBody['session_state']) { this.body.session_state = value; }

  protected init(): MarusyaResBody {
    return {
      response: {
        text: [],
        tts: '',
        buttons: [],
        end_session: false,
      },
      session: this.request.body.session,
      version: '1.0'
    };
  }
}
