/**
 * Вставка изображения через gallery-card.
 * НЕ ИСПОЛЬЗУЕТСЯ. Вместо него list-card.
 */
import { CardCommand, GalleryItem, Margins, ImageView, TextView } from '@salutejs/scenario';
import { Image } from '@uni-skill/core';

export function getImageItem({
  imageId,
  title = '',
  description = '',
  ratio = 1,
}: Image): CardCommand {
  const [ url, hash ] = imageId.split('|');
  const galleryItem: GalleryItem = {
    type: 'media_gallery_item',
    image: getImage(url, hash, ratio),
    margins: getMargins(),
    top_text: getTopText(title),
    bottom_text: getBottomText(description),
  };
  return {
    card: {
      type: 'gallery_card',
      items: [ galleryItem ]
    }
  };
}

function getImage(url: string, hash: string, aspect_ratio: number): ImageView {
  return {
    url,
    hash,
    size: {
      width: 'large',
      aspect_ratio,
    }
  };
}

function getMargins(): Margins {
  return {
    top: '5x',
    left: '5x',
    right: '5x',
    bottom: '5x',
  };
}

function getTopText(text: string): TextView {
  return {
    text,
    typeface: 'body1',
    text_color: 'default',
    max_lines: 0,
  };
}

function getBottomText(text: string): TextView {
  return {
    text,
    typeface: 'text1',
    text_color: 'secondary',
    max_lines: 0,
  };
}
