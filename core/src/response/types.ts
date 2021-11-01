export interface IResponse<TBody, TReq> {
  /** Тело платформенного ответа */
  body: TBody;
  /** Запрос, для которого этот ответ */
  request: TReq;
  /** Флаг ответа для Алисы */
  isAlice(): boolean;
  /** Флаг ответа для Сбера */
  isSber(): boolean;
  /** Флаг ответа для Маруси */
  isMarusya(): boolean;
  /** Флаг ответа для Алексы */
  isAlexa(): boolean;
  /** Пол ассистента */
  isMale: boolean;
  /** Обращение на ты/вы */
  isOfficial: boolean;
  /** Имя ассистента */
  assistantName: string;
  /** Добавить текст */
  addText(text: string, options?: TextOptions): this;
  /** Добавить озвучку */
  addVoice(ssml: string): this;
  /** Добавить текст с озвучкой */
  addVoiceText(ssml: string, options?: TextOptions): this;
  /** Добавить саджест */
  addSuggest(suggest: string[]): this;
  /** Добавить картинку */
  addImage(image: Image): this;
  /** Добавить ссылку */
  addLink(link: Link): this;
  /** Установить флаг завершения сессии */
  endSession(value?: boolean): this;
}

export interface TextOptions {
  startBubble?: boolean;
  endBubble?: boolean;
}

export interface Image {
  /** id изображения (для сбера "<url>|<hash>") */
  imageId: string;
  /** Крупная подпись */
  title?: string;
  /** Мелкая подпись */
  description?: string;
  /** Соотношение сторон (только сбер, для остальных платформ игнорируется) */
  ratio: number;
}

export interface Link {
  url: string;
  title: string;
  /** ImageId is only for Marusya. It's better to make it required and pass empty string for other platforms */
  imageId: string;
}

export type Hook = (text: string) => string;

/** Внутренний формат хранения данных, полезно для отладки и логирования */
export interface UniBody {
  text: string;
  ssml: string;
  images: Image[];
  links: Link[];
  suggest: string[];
  endSession: boolean;
}