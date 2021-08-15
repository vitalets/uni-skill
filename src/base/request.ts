/**
 * Base request.
 */

export abstract class BaseRequest<TBody> {
  body: TBody;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static match(reqBody: unknown): boolean { throw new Error('Not implemented.'); }
  constructor(reqBody: TBody) { this.body = reqBody; }
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
}
