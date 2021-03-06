/**
 * see: https://developer.sberdevices.ru/docs/ru/developer_tools/ssml/supported_characters
 */

import { escapeRegexp } from '@uni-skill/core';

export function convertSsmlForSber(s: string) {
  return wrapEmotions(convertAudio(convertAccents(s)));
}

/**
 * В сбере ударения делаются через апостроф.
 * Поэтому меняем: +а на а'
 */
const ACCENT_REGEXP = /\+([аяоёэеиыую])/ig;
function convertAccents(s: string) {
  return s.replace(ACCENT_REGEXP, '$1\'');
}

/**
 * В сбере у <audio> атрибут text вместо src.
 * Поэтому меняем: '<audio src="file.mp3"/>' на '<audio text="file.mp3"/>'
 */
const SSML_AUDIO_REGEXP = /<audio\s+src="([^"]+)"\s*\/>/ig;
function convertAudio(s: string) {
  return s.replace(SSML_AUDIO_REGEXP, '<audio text="$1"/>');
}

/**
 * В сбере определенные междометия можно завернуть в тег <audio>,
 * чтобы они произносились более эмоционально.
 */
const SBER_EMOTIONS = [
  'угу',
  'ммм',
  'тьфу',
  'ой',
  'ага',
  'ахаха',
  'м?',
  'фух',
  'ура!',
  'ой-ой-ой',
  'хах',
  'кхм-кхм',
  'бррр',
  'уф',
  'пфффф',
  'фу',
  'хм',
  'ого',
  'ааааа!',
  'эх',
  'ооооу!',
  'а-а',
  'ммм!',
  'упс',
].map(escapeRegexp).join('|');
const SBER_EMOTIONS_REGEXP = new RegExp(`(^|[\\s.,:\\-!?])(${SBER_EMOTIONS})($|[\\s.,:\\-!?])`, 'gi');
function wrapEmotions(s: string) {
  return s.replace(SBER_EMOTIONS_REGEXP, '$1<audio text="$2"/>$3');
}
