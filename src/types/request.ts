/**
 * Универсальный интерфейс запроса к навыку.
 * Все поля только на чтение.
 * Некоторые сделаны методами, чтобы работали тайпгарды.
 */

export interface IRequest<TBody> {
  /** Тело запроса */
  body: TBody;
  /** Флаг запроса от Алисы */
  isAlice(): boolean;
  /** Флаг запроса от Сбера */
  isSber(): boolean;
  /** Флаг запроса от Маруси */
  isMarusya(): boolean;
  /** Закрытие скила (в Алисе всегда false) */
  isCloseApp(): boolean;
  /** ID пользователя */
  readonly userId: string;
  /** ID сессии */
  readonly sessionId: string;
  /** ID сообщения */
  readonly messageId: number;
  /** Сообщение пользователя */
  readonly userMessage: string;
  /** Информация про операционную систему и приложение пользователя */
  readonly clientInfo: string;
  /** Флаг новой сессии в терминах платформы */
  readonly isNewSession: boolean;
  /** Флаг наличия экрана */
  readonly hasScreen: boolean;
  /** Авторизован пользователь или нет */
  readonly isAuthorized: boolean;
}
