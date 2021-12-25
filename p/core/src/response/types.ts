import { Platform } from '../request/types';

/**
 * Интерфейс универсального ответа навыка.
 *
 * Работает и на чтение, и на запись.
 * Запись происходит по принципу "только добавление". Так сделано, потому что после добавления данных
 * они раскидываются по телу ответа и модифицировать их сложно.
 *
 * Используются методы addX() вместо setX(), чтобы можно было контролировать порядок UI-элементов в ответе.
 * Например текст-картинка-текст. Сейчас это актуально только для сбера,
 * но в целом такой подход выглядит более правильным.
 */
export interface UniResponse<TBody, TReq> {
  /** Тело платформенного ответа */
  body: TBody;
  /** Тело универсального ответа (очень полезно для логирования и отладки!) */
  uniBody: UniBody;
  /** Платформа */
  platform: Platform;
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
  /** Добавить текстовый бабл */
  addText(text: string): this;
  /** Добавить озвучку */
  addVoice(ssml: string): this;
  /** Добавить текстовый бабл с озвучкой */
  addVoiceText(ssml: string): this;
  /** Добавить саджест */
  addSuggest(suggest: string[]): this;
  /** Добавить картинку */
  addImage(image: Image): this;
  /** Добавить ссылку */
  addLinks(links: Link[]): this;
  /** Установить флаг завершения сессии */
  endSession(value?: boolean): this;
  /** Установить хук, который будет обрабатывать все _отображаемые_ тексты */
  setTextHook(fn: Hook): this;
  /** Установить хук, который будет обрабатывать все _озвучиваемые_ тексты */
  setVoiceHook(fn: Hook): this;
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
