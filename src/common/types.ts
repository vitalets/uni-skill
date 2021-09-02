/**
 * Универсальный интерфейс ответа навыка.
 * Работает и на чтение, и на запись.
 * Запись происходит по принципу "только добавление". Так сделано, потому что после добавления данных
 * они раскидываются по телу ответа и модифицировать их сложно.
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
  /** Добавить бабл: текст или картинка (в Алисе всегда 1 бабл) */
  addBubble(bubble: Bubble): this;
  /** Добавить озвучку */
  addVoice(text: string): this;
  /** Добавить бабл с озвучкой. Для картинки будут озвучены title/description. */
  addVoiceBubble(bubble: Bubble): this;
  /** Добавить саджест */
  addSuggest(suggest: string | string[]): this;
  /** Установить флаг завершения сессии */
  endSession(value: boolean): this;
  /** Добавить ссылку */
  addLink(link: Link): this;
  /** Пол ассистента */
  isMale: boolean;
  /** Обращение на ты/вы */
  isOfficial: boolean;
  /** Возвращает внутреннее представление данных, полезно для отладки и логирования. */
  getUniBody(): UniBody;
  /** Установить хук, который будет обрабатывать все тексты для отображения. */
  setTextHook(fn: Hook): this;
  /** Установить хук, который будет обрабатывать все тексты для озвучки. */
  setVoiceHook(fn: Hook): this;
}

export type Bubble = string | ImageBubble;
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

export interface Link {
  url: string;
  title: string;
  /** imageId is only for Marusya */
  imageId?: string;
}

export type Hook = (text: string) => string;

/** Внутренний формат хранения данных, полезно для отладки и логирования */
export interface UniBody {
  bubbles: Bubble[];
  suggest: string[];
  links: Link[];
  voice: string;
  endSession: boolean;
}

export type State = Record<string, unknown> | undefined;
