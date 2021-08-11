/**
 * Base request.
 */

export abstract class BaseRequest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static match(reqBody: unknown): boolean { throw new Error('Not implemented.'); }
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
}
