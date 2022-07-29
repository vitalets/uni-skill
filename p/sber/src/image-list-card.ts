/**
 * Вставка изображения через list-card (говорят, оно стабильнее, чем gallery-card)
 */
import { CardCommand, ImageCellView, ListCard, TextCellView } from '@salutejs/scenario';
import { Image } from '@uni-skill/core';

export function getImageItem({
  imageId,
  title = '',
  description = '',
  ratio = 1,
}: Image): CardCommand {
  const card: ListCard = {
    type: 'list_card',
    can_be_disabled: false,
    paddings: {
      top: '5x',
      bottom: '5x',
      // Если выставить эти паддинги, то изображение становится не по центру (съезжает вправо)
      // Пробовал победить это через scale_mode, но безрезультатно
      // left: '5x',
      // right: '5x',
    },
    cells: [
      getImageCell(imageId, ratio),
    ]
  };
  if (title) card.cells.push(getTitleCell(title));
  if (description) card.cells.push(getDescriptionCell(description));
  return { card };
}

function getImageCell(imageId: string, aspect_ratio: number): ImageCellView {
  const [ url, hash ] = imageId.split('|');
  return {
    type: 'image_cell_view',
    content: {
      url,
      hash,
      // scale_mode: 'scale_aspect_fit', // изображение слишком маленькое в центре
      // scale_mode: 'scale_aspect_fill', // никакого эффекта по сравнению с отсутствием scale_mode
      size: {
        width: 'resizable',
        aspect_ratio,
      }
    }
  };
}

function getTitleCell(text: string): TextCellView {
  return {
    type: 'text_cell_view',
    content: {
      text,
      typeface: 'body1',
      text_color: 'default',
      max_lines: 0,
      margins: {
        left: '5x',
        right: '5x',
        bottom: '2x',
      }
    }
  };
}

function getDescriptionCell(text: string): TextCellView {
  return {
    type: 'text_cell_view',
    content: {
      text,
      typeface: 'text1',
      text_color: 'secondary',
      max_lines: 0,
      margins: {
        left: '5x',
        right: '5x',
        // bottom: '5x',
      }
    }
  };
}
