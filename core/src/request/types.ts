export interface IRequest<TBody, TRes> {
  /** Тело запроса */
  body: TBody;
  /** Создать ответ для этого запроса */
  createResponse(): TRes;
  /** Флаг запроса от Алисы */
  isAlice(): boolean;
  /** Флаг запроса от Сбера */
  isSber(): boolean;
  /** Флаг запроса от Маруси */
  isMarusya(): boolean;
  /** Флаг запроса от Алексы */
  isAlexa(): boolean;
  /** Флаг закрытия скила (в Алисе всегда false) */
  isCloseApp(): boolean;
  /** ID пользователя */
  userId: string;
  /** ID сессии */
  sessionId: string;
  /** ID сообщения */
  messageId: number;
  /** Сообщение пользователя */
  userMessage: string;
  /** Информация про операционную систему и приложение пользователя */
  clientInfo: string;
  /** Флаг новой сессии в терминах платформы */
  isNewSession: boolean;
  /** Флаг наличия экрана */
  hasScreen: boolean;
  /** Авторизован пользователь или нет */
  isAuthorized: boolean;
  /** Получить интент */
  getIntent(name: string): Intent | undefined;
}

export interface IRequestConstructor<TBody, TRes> {
  /** Попытка создать инстанс запроса по телу */
  create(reqBody: unknown): IRequest<TBody, TRes> | undefined;
  new(reqBody: TBody): IRequest<TBody, TRes>;
}

export type State = Record<string, unknown> | undefined;

export interface Intent {
  name: string;
  slots: Record<string, unknown>;
}