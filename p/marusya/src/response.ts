/**
 * Marusya response.
 */
import { ResBody } from 'marusya-types';
import {
  UniResponse,
  BaseResponse,
  Image,
  State,
  Link,
  concatWithSpace,
  stripSpeakTag,
} from '@uni-skill/core';
import { MarusyaRequest } from './request';
import { convertSsmlForMarusya } from './ssml';

// Use fake Omit to have 'MarusyaResBody' in ts messages.
type MarusyaResBody = Omit<ResBody, ''>;

export class MarusyaResponse
extends BaseResponse<MarusyaResBody, MarusyaRequest>
implements UniResponse<MarusyaResBody, MarusyaRequest> {
  isMarusya(): this is MarusyaResponse { return true; }
  assistantName = 'Маруся';

  protected platformAddText(text: string) {
    (this.body.response.text as string[]).push(text);
  }

  protected platformAddVoice(ssml: string) {
    // Note! Разметка SSML работает только со звуками из Библиотеки.
    // See: https://dev.vk.com/marusia/ssml#%3Cspeaker%3E
    if (this.body.response.tts_type === 'ssml') {
      this.platformAddVoiceSsml(ssml);
    } else {
      this.platformAddVoiceTts(ssml);
    }
  }

  protected platformAddSuggest(suggest: string[]) {
    this.body.response.buttons!.push(
      ...suggest.map(title => ({ title }))
    );
  }

  protected platformEndSession(value: boolean) {
    this.body.response.end_session = value;
  }

  /** В Марусе возможна только 1 картинка */
  protected platformAddImage({ imageId, title, description }: Image) {
    const { card } = this.body.response;
    if (card && card.type !== 'BigImage') {
      throw new Error(`Response already contains card: ${card.type}`);
    }
    this.body.response.card = {
      type: 'BigImage',
      image_id: Number(imageId),
    };
    if (title) this.platformAddText(title);
    if (description) this.platformAddText(description);
  }

  /** В Марусе возможна только 1 ссылка, и та вместо картинки */
  protected platformAddLinks(links: Link[]) {
    const { card } = this.body.response;
    if (card) {
      const msg = card.type === 'Link'
        ? `Response already contains link: ${JSON.stringify(card)}`
        : `Response already contains another card: ${JSON.stringify(card)}`;
      throw new Error(msg);
    }
    if (links.length > 1) {
      throw new Error(`Marusya can show only one link`);
    }
    const { url, title, imageId } = links[0];
    if (!imageId) {
      throw new Error('ImageId is required for Marusya link');
    }
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

  private platformAddVoiceTts(ssml: string) {
    const { response } = this.body;
    ssml = convertSsmlForMarusya(ssml);
    response.tts = concatWithSpace(stripSpeakTag(response.tts), stripSpeakTag(ssml));
  }

  private platformAddVoiceSsml(ssml: string) {
    const { response } = this.body;
    ssml = convertSsmlForMarusya(ssml);
    ssml = concatWithSpace(stripSpeakTag(response.ssml), stripSpeakTag(ssml));
    response.ssml = `<speak>${ssml}</speak>`;
  }

  protected initBody(): MarusyaResBody {
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
