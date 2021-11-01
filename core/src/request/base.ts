/**
 * Универсальный интерфейс запроса к навыку.
 * Все поля только на чтение.
 * Некоторые сделаны методами, чтобы работали тайпгарды.
 */

import { IRequest } from './types';

export class BaseRequest<TBody, TRes> implements Partial<IRequest<TBody, TRes>> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static match(reqBody: unknown): boolean { throw new Error(`Not implemented.`); }
  constructor(reqBody: TBody) { this.body = reqBody; }
  body: TBody;
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
  isAlexa() { return false; }
}

// export abstract class CommonRequest<TBody> {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   static match(reqBody: unknown): boolean { throw new Error(`Not implemented.`); }
//   constructor(reqBody: TBody) { this.body = reqBody; }
//   /** Тело запроса */
//   body: TBody;
//   /** Флаг запроса от Алисы */
//   isAlice() { return false; }
//   /** Флаг запроса от Сбера */
//   isSber() { return false; }
//   /** Флаг запроса от Маруси */
//   isMarusya() { return false; }
//   /** Флаг запроса от Алексы */
//   isAlexa() { return false; }
//   /** Флаг закрытия скила (в Алисе всегда false) */
//   abstract isCloseApp(): boolean;
//   /** ID пользователя */
//   abstract readonly userId: string;
//   /** ID сессии */
//   abstract readonly sessionId: string;
//   /** ID сообщения */
//   abstract readonly messageId: number;
//   /** Сообщение пользователя */
//   abstract readonly userMessage: string;
//   /** Информация про операционную систему и приложение пользователя */
//   abstract readonly clientInfo: string;
//   /** Флаг новой сессии в терминах платформы */
//   abstract readonly isNewSession: boolean;
//   /** Флаг наличия экрана */
//   abstract readonly hasScreen: boolean;
//   /** Авторизован пользователь или нет */
//   abstract readonly isAuthorized: boolean;
//   /** Получить интент */
//   abstract getIntent(name: string): Intent | undefined;
// }

// export interface UniRequestConstructor<TBody> {
//   new(reqBody: TBody): UniRequest<TBody>;
//   match(reqBody: unknown): boolean;
// }
