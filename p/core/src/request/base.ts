/**
 * Базовая реализация запроса.
 */

import { UniRequest } from './types';

export class BaseRequest<TBody, TRes> implements Partial<UniRequest<TBody, TRes>> {
  constructor(reqBody: TBody) { this.body = reqBody; }
  body: TBody;
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
  isAlexa() { return false; }
}
