/**
 * Debug local skill on real device.
 */

import 'dotenv/config';
import { runClient } from 'skill-dev-proxy';
import { handler } from '../playground/skill';

runClient({
  wsUrl: process.env.SKILL_DEV_PROXY_URL!,
  handler,
});
