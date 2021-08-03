/**
 * Universal skill request.
 */

export interface IRequest<TBody> {
  /** Тело запроса */
  body: TBody;
  isAlice(): boolean;
  isSber(): boolean;
  isMarusya(): boolean;
  readonly userId: string;
  readonly sessionId: string;
  readonly messageId: number;
  readonly userMessage: string;
  readonly isNewSession: boolean;
  readonly hasScreen: boolean;
  readonly isAuthorized: boolean;

  // Marusya does not support applicationState
  // Sber doest not support any state :(
  // readonly userState: State;
  // readonly applicationState: State;
  // readonly sessionState: State;
}

export abstract class BaseRequest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static match(reqBody: unknown): boolean { throw new Error('Not implemented.'); }
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
}

export type State = Record<string, unknown> | undefined;
