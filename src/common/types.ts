/**
 * Types
 */

export interface Image {
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

export type State = Record<string, unknown> | undefined;

export interface Intent {
  name: string;
  slots: Record<string, unknown>;
}
