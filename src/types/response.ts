/**
 * Универсальный интерфейс ответа навыка.
 */

export interface IResponse<TBody> {
  /** Тело ответа под платформу */
  body: TBody;
  /** Флаг ответа для Алисы */
  isAlice(): boolean;
  /** Флаг ответа для Сбера */
  isSber(): boolean;
  /** Флаг ответа для Маруси */
  isMarusya(): boolean;
  /** Массив баблов: текст или картинка (в Алисе все в 1 бабл) */
  bubbles: Bubble[];
  /** Озвучка */
  tts: string;
  /** Кнопки-саджесты */
  suggest: string[];
  /** Флаг завершения сессии */
  endSession: boolean;
  /** М/ж */
  isMale: boolean;
  /** Ты/вы */
  isOfficial: boolean;
}

export type Bubble = TextBubble | ImageBubble;
export type TextBubble = string;
export interface ImageBubble {
  /** id изображения (для сбера "<url>|<hash>") */
  imageId: string;
  /** Крупная подпись */
  title?: string;
  /** Мелкая подпись */
  description?: string;
  /** Соотношение сторон (только сбер) */
  ratio?: number;
}
