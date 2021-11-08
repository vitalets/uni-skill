import { CardCommand, ButtonCellView } from '@salutejs/types';
import { Link } from '@uni-skill/core';

export function getLinkItem({ title, url }: Link): CardCommand {
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
    }
  };
  return {
    card: {
      type: 'list_card',
      cells: [ linkItem ]
    }
  };
}
