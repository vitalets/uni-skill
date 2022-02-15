/**
 * Базовая реализация запроса.
 */

import { UniRequest } from './types';

export abstract class BaseRequest<TBody, TRes> implements Partial<UniRequest<TBody, TRes>> {
  constructor(reqBody: TBody) { this.body = reqBody; }
  body: TBody;
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
  isAlexa() { return false; }
  isPing() { return false; }
  get userMessage() {
    return (this.platformUserMessage || '').replace(/[?!,.]/g, '').toLocaleLowerCase();
  }
  protected abstract platformUserMessage: string | void;
}
