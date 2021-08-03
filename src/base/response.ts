/**
 * Universal skill response.
 */
// import { State } from './request';

export abstract class BaseResponse {
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
}

export interface IResponse<TBody> {
  /** Тело ответа */
  body: TBody;
  /** Озвучка */
  tts: string;
  /** Текст (в первом бабле) */
  text: string;
  /** Флаг завершения сессии */
  endSession: boolean;
  /** Кнопки-саджесты */
  addButtons(titles: string[]): void;
  // Marusya does not support applicationState
  // Sber does not support any state
  // userState: State;
  // applicationState: State;
  // sessionState: State;
}
