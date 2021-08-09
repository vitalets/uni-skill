import { CardCommand, GalleryItem, ImageView, Margins1, TextView } from '@salutejs/types';
import { ResponseImage } from '../base/response';

export function getImageItem({
  id,
  title = '',
  description = '',
  ratio = 1,
}: ResponseImage): CardCommand {
  const [ url, hash ] = id.split('|');
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

function getMargins(): Margins1 {
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
    typeface: 'title2',
    text_color: 'default',
    max_lines: 0,
  };
}

function getBottomText(text: string): TextView {
  return {
    text,
    typeface: 'body1',
    text_color: 'secondary',
    max_lines: 0,
    margins: {
      top: '2x'
    }
  };
}
