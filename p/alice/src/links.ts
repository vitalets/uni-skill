import { Link } from '@uni-skill/core';
import { BigImage, Button } from 'alice-types';

export function addLinksToTextBubble(links: Link[], buttons: Button[]) {
  const aliceLinks = links.map(({ url, title }) => ({ url, title, hide: false }));
  buttons.push(...aliceLinks);
}

export function addLinksToCard(links: Link[], card: BigImage) {
  if (links.length > 1) {
    throw new Error(`Alice BigImage can show only one link, passed: ${JSON.stringify(links)}`);
  }
  if (card.button?.url) {
    throw new Error(`Alice BigImage already contains link: ${JSON.stringify(card.button)}`);
  }
  const { url, title } = links[0];
  card.button = { url, text: title };
}
