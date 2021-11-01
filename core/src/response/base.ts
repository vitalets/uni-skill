/**
 * Базовая реализация ответа.
 */

import { IResponse, Hook, Image, Link, UniBody } from './types';
import {
  concatWithSpace,
  concatWithNewline,
  stripSpeakTag,
  stripEmoji,
  stripAccents,
  stripAllTags,
} from '../utils';

export abstract class BaseResponse<TBody, TReq> implements Partial<IResponse<TBody, TReq>> {
  body: TBody;
  request: TReq;
  isMale = false;
  isOfficial = true;
  assistantName = '';

  /** Тело универсального ответа (Убрать?) */
  protected uniBody: UniBody = {
    text: '',
    ssml: '',
    images: [],
    links: [],
    suggest: [],
    endSession: false,
  };

  protected textHook?: Hook;
  protected voiceHook?: Hook;

  protected abstract init(): TBody;
  protected abstract addTextInternal(text: string): void;
  protected abstract addImageInternal(image: Image): void;
  protected abstract addVoiceInternal(fullSsml: string): void;
  protected abstract addSuggestInternal(suggest: string[]): void;
  protected abstract addLinksInternal(links: Link[]): void;
  protected abstract endSessionInternal(value: boolean): void;

  constructor(request: TReq) {
    this.request = request;
    this.body = this.init();
  }

  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
  isAlexa() { return false; }

  addText(text: string) {
    text = stripAllTags(stripAccents(this.applyTextHook(text)));
    this.uniBody.text = concatWithNewline(this.uniBody.text, text);
    this.addTextInternal(text);
    return this;
  }

  addVoice(ssml: string) {
    ssml = stripEmoji(stripSpeakTag(this.applyVoiceHook(ssml)));
    this.uniBody.ssml = concatWithSpace(this.uniBody.ssml, ssml);
    this.addVoiceInternal(ssml);
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
    this.addSuggestInternal(suggest);
    return this;
  }

  addImage({ imageId, title, description, ratio }: Image) {
    title = this.applyTextHook(title);
    description = this.applyTextHook(description);
    const image = { imageId, title, description, ratio };
    this.uniBody.images.push(image);
    this.addImageInternal(image);
    return this;
  }

  addLinks(links: Link[]) {
    if (!links?.length) return this;
    this.uniBody.links.push(...links);
    this.addLinksInternal(links);
    return this;
  }

  endSession(value = true) {
    this.uniBody.endSession = value;
    this.endSessionInternal(value);
    return this;
  }

//   /** Возвращает внутреннее представление данных, полезно для отладки и логирования. */
//   getUniBody() { return this.uniBody; }
//   /** Установить хук, который будет обрабатывать все тексты для отображения. */
//   setTextHook(fn: Hook) { this.textHook = fn; }
//   /** Установить хук, который будет обрабатывать все тексты для озвучки. */
//   setVoiceHook(fn: Hook) { this.voiceHook = fn; }

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
}
