/**
 * Universal skill response.
 */
// import { State } from './request';

export abstract class BaseResponse {
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
}

export interface IResponse {
  body: unknown;
  data: unknown;
  // Marusya does not support applicationState
  // Sber does not support any state
  // userState: State;
  // applicationState: State;
  // sessionState: State;
}
