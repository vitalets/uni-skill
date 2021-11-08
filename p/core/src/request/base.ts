/**
 * Базовая реализация запроса.
 */

import { IRequest } from './types';

export class BaseRequest<TBody, TRes> implements Partial<IRequest<TBody, TRes>> {
  constructor(reqBody: TBody) { this.body = reqBody; }
  body: TBody;
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
  isAlexa() { return false; }
}
