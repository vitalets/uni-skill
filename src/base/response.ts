/**
 * Универсальный интерфейс ответа навыка.
 * Работает и на чтение, и на запись.
 * Запись происходит по принципу "только добавление". Так сделано, потому что после добавления данных
 * они раскидываются по телу ответа и модифицировать их сложно.
 */

import { Bubble, UniBody, Hook, ImageBubble, Link } from './types';
import { concatWithSeparator, stripSpeakTags, stripEmoji } from '../utils';

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
    bubbles: [],
    suggest: [],
    links: [],
    voice: '',
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

  /** Добавить бабл: текст или картинка (в Алисе всегда 1 бабл) */
  addBubble(bubble: Bubble) {
    if (typeof bubble === 'string') {
      this.addTextBubble(bubble);
    } else if ('imageId' in bubble) {
      this.addImageBubble(bubble);
    } else {
      throw new Error(`Unknown bubble type: ${bubble}`);
    }
    return this;
  }

  /** Добавить озвучку */
  addVoice(text = '') {
    const processedText = stripEmoji(stripSpeakTags(this.applyVoiceHook(text)));
    this.uniBody.voice = concatWithSeparator(this.uniBody.voice, processedText, ' ');
    this.setVoiceInternal(this.uniBody.voice);
    return this;
  }

  /** Добавить саджест */
  addSuggest(suggest: string | string[]) {
    const arr = (Array.isArray(suggest) ? suggest : [ suggest ])
      .filter(Boolean)
      .map(item => this.applyTextHook(item) as string);
    this.uniBody.suggest.push(...arr);
    this.addSuggestInternal(arr);
    return this;
  }

  /** Добавить ссылку */
  addLink(link: Link) {
    this.uniBody.links.push(link);
    this.addLinkInternal(link);
    return this;
  }

  /** Установить флаг завершения сессии */
  endSession(value: boolean) {
    this.uniBody.endSession = value;
    this.endSessionInternal(value);
    return this;
  }

  /** Добавить бабл с озвучкой. Для картинки будут озвучены title/description. */
  addVoiceBubble(bubble: Bubble) {
    this.addBubble(bubble);
    if (typeof bubble === 'string') {
      this.addVoice(bubble);
    } else {
      const { title, description } = bubble;
      this.addVoice(title);
      this.addVoice(description);
    }
    return this;
  }

  /** Возвращает внутреннее представление данных, полезно для отладки и логирования. */
  getUniBody() { return this.uniBody; }
  /** Установить хук, который будет обрабатывать все тексты для отображения. */
  setTextHook(fn: Hook) { this.textHook = fn; return this; }
  /** Установить хук, который будет обрабатывать все тексты для озвучки. */
  setVoiceHook(fn: Hook) { this.voiceHook = fn; return this; }

  private addTextBubble(text?: string) {
    text = this.applyTextHook(text);
    if (text) {
      this.uniBody.bubbles.push(text);
      this.addTextInternal(text);
    }
  }

  private addImageBubble({ imageId, title, description, ratio }: ImageBubble) {
    title = this.applyTextHook(title);
    description = this.applyTextHook(description);
    const image = { imageId, title, description, ratio };
    this.uniBody.bubbles.push(image);
    this.addImageInternal(image);
  }

  private applyTextHook(text?: string) {
    return (this.textHook && typeof text === 'string') ? this.textHook(text) : text;
  }

  private applyVoiceHook(text?: string) {
    return (this.voiceHook && typeof text === 'string') ? this.voiceHook(text) : text;
  }

  protected abstract init(): TBody;
  protected abstract addTextInternal(text: string): void;
  protected abstract addImageInternal(image: ImageBubble): void;
  protected abstract setVoiceInternal(text: string): void;
  protected abstract addSuggestInternal(suggest: string[]): void;
  protected abstract addLinkInternal(link: Link): void;
  protected abstract endSessionInternal(value: boolean): void;
}
