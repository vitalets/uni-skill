/**
 * Debug local skill on real device.
 */

import { runClient } from 'skill-dev-proxy';
import { SKILL_DEV_PROXY_URL } from '../.env';
import { handler } from '../playground/skill';

runClient({
  wsUrl: SKILL_DEV_PROXY_URL,
  handler,
});
