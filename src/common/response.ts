/**
 * Универсальный интерфейс ответа навыка.
 * Работает и на чтение, и на запись.
 * Запись происходит по принципу "только добавление". Так сделано, потому что после добавления данных
 * они раскидываются по телу ответа и модифицировать их сложно.
 */

import { UniBody, Hook, Image, Link } from './types';
import {
  concatWithSpace,
  concatWithNewline,
  stripSpeakTag,
  stripEmoji,
  stripAccents,
  stripAllTags,
} from '../utils';

export abstract class CommonResponse<TBody, TReq> {
  /** Тело платформенного ответа */
  body: TBody;
  /** Пол ассистента */
  isMale = false;
  /** Обращение на ты/вы */
  isOfficial = true;
  /** Запрос, для которого этот ответ */
  request: TReq;
  /** Тело универсального ответа */
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

  constructor(request: TReq) {
    this.request = request;
    this.body = this.init();
  }

  /** Флаг ответа для Алисы */
  isAlice() { return false; }
  /** Флаг ответа для Сбера */
  isSber() { return false; }
  /** Флаг ответа для Маруси */
  isMarusya() { return false; }
  /** Флаг ответа для Алексы */
  isAlexa() { return false; }

  /** Добавить текст */
  addText(text: string) {
    text = stripAllTags(stripAccents(this.applyTextHook(text)));
    this.uniBody.text = concatWithNewline(this.uniBody.text, text);
    this.addTextInternal(text);
    return this;
  }

  /** Добавить озвучку */
  addVoice(ssml: string) {
    ssml = stripEmoji(stripSpeakTag(this.applyVoiceHook(ssml)));
    this.uniBody.ssml = concatWithSpace(this.uniBody.ssml, ssml);
    this.addVoiceInternal(ssml);
    return this;
  }

  /** Добавить текст с озвучкой */
  addVoiceText(ssml: string) {
    this.addVoice(ssml);
    // todo: extract text from ssml
    this.addText(ssml);
    return this;
  }

  /** Добавить саджест */
  addSuggest(suggest: string[]) {
    suggest = suggest.map(item => this.applyTextHook(item));
    this.uniBody.suggest.push(...suggest);
    this.addSuggestInternal(suggest);
    return this;
  }

  /** Добавить картинку */
  addImage({ imageId, title, description, ratio }: Image) {
    title = this.applyTextHook(title);
    description = this.applyTextHook(description);
    const image = { imageId, title, description, ratio };
    this.uniBody.images.push(image);
    this.addImageInternal(image);
    return this;
  }

  /** Добавить ссылку */
  addLink(link: Link) {
    this.uniBody.links.push(link);
    this.addLinkInternal(link);
    return this;
  }

  /** Установить флаг завершения сессии */
  endSession(value = true) {
    this.uniBody.endSession = value;
    this.endSessionInternal(value);
    return this;
  }

  /** Возвращает внутреннее представление данных, полезно для отладки и логирования. */
  getUniBody() { return this.uniBody; }
  /** Установить хук, который будет обрабатывать все тексты для отображения. */
  setTextHook(fn: Hook) { this.textHook = fn; }
  /** Установить хук, который будет обрабатывать все тексты для озвучки. */
  setVoiceHook(fn: Hook) { this.voiceHook = fn; }

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

  protected abstract init(): TBody;
  protected abstract addTextInternal(text: string): void;
  protected abstract addImageInternal(image: Image): void;
  protected abstract addVoiceInternal(fullSsml: string): void;
  protected abstract addSuggestInternal(suggest: string[]): void;
  protected abstract addLinkInternal(link: Link): void;
  protected abstract endSessionInternal(value: boolean): void;
}
