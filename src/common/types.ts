/**
 * Types
 */

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
