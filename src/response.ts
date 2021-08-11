/**
 * Универсальный интерфейс ответа навыка.
 */

export interface IResponse<TBody> {
  /** Тело ответа */
  body: TBody;
  /** Флаг ответа для Алисы */
  isAlice(): boolean;
  /** Флаг ответа для Сбера */
  isSber(): boolean;
  /** Флаг ответа для Маруси */
  isMarusya(): boolean;
  /** Добавить текстовый бабл (в Алисе тот же бабл через перенос строки) */
  addText(value: string): void;
  /** Добавить озвучку */
  addTts(value: string): void;
  /** Добавить кнопки-саджесты */
  addSuggest(titles: string[]): void;
  /** Добавить изображение */
  addImage(image: ResponseImage): void;
  /** Флаг завершения сессии */
  endSession: boolean;
}

export interface ResponseImage {
  /** id изображения (для сбера "<url>|<hash>") */
  id: string;
  /** Крупная подпись */
  title?: string;
  /** Мелкая подпись */
  description?: string;
  /** Соотношение сторон (только сбер) */
  ratio?: number;
}
