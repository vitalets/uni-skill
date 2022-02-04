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
import { ResponseConfig } from '..';
import { handleRespeech } from '../respeech';

export abstract class BaseResponse<TBody, TReq extends UniRequest<unknown, unknown>>
implements Partial<UniResponse<TBody, TReq>> {
  body: TBody;
  request: TReq;
  isMale = false;
  isOfficial = true;
  assistantName = '';

  uniBody: UniBody;
  config: ResponseConfig = {
    respeech: false
  };

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
    text = this.handleText(text || '');
    this.uniBody.text = concatWithNewline(this.uniBody.text, text);
    this.platformAddText(text);
    return this;
  }

  addVoice(ssml: string) {
    ssml = this.handleSsml(ssml || '');
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

  addImage({ imageId, title, description, ratio }: Image) {
    title = title && this.handleText(title);
    description = description && this.handleText(description);
    const image = { imageId, title, description, ratio };
    this.uniBody.images.push(image);
    this.platformAddImage(image);
    return this;
  }

  addSuggest(suggest: string[]) {
    if (!suggest?.length) return this;
    this.uniBody.suggest.push(...suggest);
    this.platformAddSuggest(suggest);
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

  setTextHook(fn: Hook) {
    this.textHook = fn;
    return this;
  }

  setVoiceHook(fn: Hook) {
    this.voiceHook = fn;
    return this;
  }

  private handleText(text: string) {
    text = this.applyTextHook(text);
    text = this.applyRespeech(text);
    text = stripAccents(text);
    text = stripAllTags(text);
    return text;
  }

  private handleSsml(ssml: string) {
    ssml = this.applyVoiceHook(ssml);
    ssml = this.applyRespeech(ssml);
    ssml = stripSpeakTag(ssml);
    ssml = stripEmoji(ssml);
    return ssml;
  }

  private applyTextHook<T extends string | undefined>(text: T) {
    return this.textHook && typeof text === 'string'
      ? this.textHook(text)
      : text;
  }

  private applyVoiceHook<T extends string | undefined>(text: T) {
    return this.voiceHook && typeof text === 'string'
      ? this.voiceHook(text)
      : text;
  }

  private applyRespeech<T extends string | undefined>(text: T) {
    return this.config.respeech
      ? handleRespeech(text, { isMale: this.isMale, isOfficial: this.isOfficial })
      : text;
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
