/**
 * Marusya response.
 */
import { ResBody } from 'marusya-types';
import { CommonResponse } from '../common/response';
import { Image, Link, State } from '../common/types';
import { MarusyaRequest } from './request';

// Use fake Omit to have 'MarusyaResBody' in ts messages.
type MarusyaResBody = Omit<ResBody, ''>;

export class MarusyaResponse extends CommonResponse<MarusyaResBody, MarusyaRequest> {
  isMarusya(): this is MarusyaResponse { return true; }

  protected addTextInternal(text: string) {
    (this.body.response.text as string[]).push(text);
  }

  protected addVoiceInternal(fullSsml: string) {
    this.body.response.tts = fullSsml;
  }

  protected addSuggestInternal(suggest: string[]) {
    this.body.response.buttons = suggest.map(title => ({ title }));
  }

  protected endSessionInternal(value: boolean) {
    this.body.response.end_session = value;
  }

  protected addImageInternal({ imageId, title, description }: Image) {
    const { card } = this.body.response;
    if (card && card.type !== 'BigImage') {
      throw new Error(`Response already contains card: ${card.type}`);
    }
    this.body.response.card = {
      type: 'BigImage',
      image_id: Number(imageId),
    };
    if (title) this.addTextInternal(title);
    if (description) this.addTextInternal(description);
  }

  /**
   * Marusya can't have link without image.
   */
  protected addLinkInternal({ title, url, imageId }: Link) {
    const { card } = this.body.response;
    if (card && card.type !== 'Link') {
      throw new Error(`Response already contains card: ${card.type}`);
    }
    if (!imageId) throw new Error('ImageId is required for Marusya link');
    this.body.response.card = {
      type: 'Link',
      url,
      title,
      text: '',
      image_id: Number(imageId),
    };
  }

  /** Для userState используем дополнительный ключ data, чтобы легче было сбрасывать стейт */
  get userState() { return this.body.user_state_update?.data as State; }
  set userState(data: State) { this.body.user_state_update = { data }; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: State) { this.body.session_state = value; }

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
