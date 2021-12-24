/**
 * Базовая реализация ответа.
 */

import { UniResponse, Hook, Image, Link, UniBody } from './types';
import {
  concatWithSpace,
  concatWithNewline,
  stripSpeakTag,
  stripEmoji,
  stripAccents,
  stripAllTags,
} from '../utils';
import { UniRequest } from '../request/types';

export abstract class BaseResponse<TBody, TReq extends UniRequest<unknown, unknown>>
implements Partial<UniResponse<TBody, TReq>> {
  body: TBody;
  request: TReq;
  isMale = false;
  isOfficial = true;
  assistantName = '';

  uniBody: UniBody;

  protected textHook?: Hook;
  protected voiceHook?: Hook;

  protected abstract initBody(): TBody;
  protected abstract platformAddText(text: string): void;
  protected abstract platformAddImage(image: Image): void;
  protected abstract platformAddVoice(fullSsml: string): void;
  protected abstract platformAddSuggest(suggest: string[]): void;
  protected abstract platformAddLinks(links: Link[]): void;
  protected abstract platformEndSession(value: boolean): void;

  constructor(request: TReq) {
    this.request = request;
    this.body = this.initBody();
    this.uniBody = this.initUniBody();
  }

  get platform() { return this.request.platform; }

  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
  isAlexa() { return false; }

  addText(text: string) {
    text = stripAllTags(stripAccents(this.applyTextHook(text)));
    this.uniBody.text = concatWithNewline(this.uniBody.text, text);
    this.platformAddText(text);
    return this;
  }

  addVoice(ssml: string) {
    ssml = stripEmoji(stripSpeakTag(this.applyVoiceHook(ssml)));
    this.uniBody.ssml = concatWithSpace(this.uniBody.ssml, ssml);
    this.platformAddVoice(ssml);
    return this;
  }

  addVoiceText(ssml: string) {
    this.addVoice(ssml);
    // todo: extract text from ssml
    this.addText(ssml);
    return this;
  }

  addSuggest(suggest: string[]) {
    if (!suggest?.length) return this;
    suggest = suggest.map(item => this.applyTextHook(item));
    this.uniBody.suggest.push(...suggest);
    this.platformAddSuggest(suggest);
    return this;
  }

  addImage({ imageId, title, description, ratio }: Image) {
    title = this.applyTextHook(title);
    description = this.applyTextHook(description);
    const image = { imageId, title, description, ratio };
    this.uniBody.images.push(image);
    this.platformAddImage(image);
    return this;
  }

  addLinks(links: Link[]) {
    if (!links?.length) return this;
    this.uniBody.links.push(...links);
    this.platformAddLinks(links);
    return this;
  }

  endSession(value = true) {
    this.uniBody.endSession = value;
    this.platformEndSession(value);
    return this;
  }

//   /** Возвращает внутреннее представление данных, полезно для отладки и логирования. */
//   getUniBody() { return this.uniBody; }
  setTextHook(fn: Hook) {
    this.textHook = fn;
    return this;
  }

  setVoiceHook(fn: Hook) {
    this.voiceHook = fn;
    return this;
  }

  reset() {
    this.body = this.initBody();
    this.uniBody = this.initUniBody();
    // todo: переносить ли sessionState?
    return this;
  }

  private applyTextHook<T extends string | undefined>(str: T) {
    return this.textHook && typeof str === 'string'
      ? this.textHook(str)
      : str;
  }

  private applyVoiceHook<T extends string | undefined>(str: T) {
    return this.voiceHook && typeof str === 'string'
      ? this.voiceHook(str)
      : str;
  }

  private initUniBody():UniBody {
    return {
      text: '',
      ssml: '',
      images: [],
      links: [],
      suggest: [],
      endSession: false,
    };
  }
}
