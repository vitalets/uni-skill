/**
 * Base response.
 */

import { Bubble, UniBody, Hook, ImageBubble } from '../types/response';

export abstract class BaseResponse<TBody, TReq> {
  /** Тело платформенного ответа */
  body: TBody;
  /** Запрос, для которого этот ответ */
  protected request: TReq;
  /** Тело универсального ответа */
  protected uniBody: UniBody = {
    bubbles: [],
    suggest: [],
    voice: '',
    endSession: false,
  };

  protected textHook?: Hook;
  protected voiceHook?: Hook;

  isMale = false;
  isOfficial = true;

  constructor(request: TReq) {
    this.request = request;
    this.body = this.init();
  }

  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }

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

  addVoice(text = '') {
    const hookedText = this.applyVoiceHook(text);
    this.uniBody.voice = `${this.uniBody.voice ?? ''} ${hookedText ?? ''}`.trim();
    this.setVoiceInternal(this.uniBody.voice);
    return this;
  }

  addSuggest(suggest: string | string[]) {
    const arr = (Array.isArray(suggest) ? suggest : [ suggest ])
      .filter(Boolean)
      .map(item => this.applyTextHook(item) as string);
    this.uniBody.suggest.push(...arr);
    this.addSuggestInternal(arr);
    return this;
  }

  endSession(value: boolean) {
    this.uniBody.endSession = value;
    this.endSessionInternal(value);
    return this;
  }

  addVoiceBubble(bubble: Bubble) {
    this.addBubble(bubble);
    if (typeof bubble === 'string') {
      return this.addVoice(bubble);
    } else {
      const { title, description } = bubble;
      return this.addVoice(`${title ?? ''} ${description ?? ''}`.trim());
    }
  }

  getUniBody() { return this.uniBody; }
  setTextHook(fn: Hook) { this.textHook = fn; return this; }
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
  protected abstract endSessionInternal(value: boolean): void;
}
