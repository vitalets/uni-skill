/**
 * Universal skill response.
 */

export interface IResponse<TBody> {
  /** Тело ответа */
  body: TBody;
  /** Добавить текстовый бабл */
  addText(value: string): void;
  /** Добавить озвучку */
  addTts(value: string): void;
  /** Кнопки-саджесты */
  addButtons(titles: string[]): void;
  /** Изображение */
  addImage(image: ResponseImage): void;
  /** Флаг завершения сессии */
  endSession: boolean;
  // Marusya does not support applicationState
  // Sber does not support any state
  // userState: State;
  // applicationState: State;
  // sessionState: State;
}

export interface ResponseImage {
  /** id изображения (для сбера урл) */
  id: string;
  /** Крупная подпись */
  title?: string;
  /** Мелкая подпись */
  description?: string;
  /** Соотношение сторон (только сбер) */
  ratio?: number;
}

export abstract class BaseResponse {
  isAlice() { return false; }
  isSber() { return false; }
  isMarusya() { return false; }
}
