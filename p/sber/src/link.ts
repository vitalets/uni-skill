import { CardCommand, ButtonCellView, PlatformType } from '@salutejs/types';
import { Link } from '@uni-skill/core';

export function getLinkItem({ title, url }: Link, platformType: PlatformType): CardCommand {
  const linkItem: ButtonCellView = {
    type: 'button_cell_view',
    content: {
      text: title,
      typeface: 'button1',
      style: 'default',
      type: 'accept',
      actions: [{
        type: 'deep_link',
        deep_link: url
      }],
      margins: {
        top: '8x',
        bottom: '8x',
      }
    }
  };

  // На ios марджины у кнопки превращаются в паддинги :(, выглядит стремно, поэтому убираем
  if (platformType.toLowerCase() === 'ios') {
    delete linkItem.content.margins;
  }

  return {
    card: {
      type: 'list_card',
      cells: [ linkItem ]
    }
  };
}
