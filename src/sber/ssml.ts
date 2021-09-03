/**
 * see: https://developer.sberdevices.ru/docs/ru/developer_tools/ssml/supported_characters
 */

export function convertSsmlForSber(s: string) {
  return convertAudio(convertAccents(s));
}

/**
 * В сбере ударения делаются через апостроф.
 */
const ACCENT_REGEXP = /\+([аяоёэеиыую])/ig;
function convertAccents(s: string) {
  return s.replace(ACCENT_REGEXP, '$1\'');
}

/**
 * В сбере у <audio> атрибут text вместо src.
 */
 const SSML_AUDIO_REGEXP = /<audio\s+src="([^"]+)"\s*\/>/ig;
 function convertAudio(s: string) {
   return s.replace(SSML_AUDIO_REGEXP, '<audio text="$1" />');
 }
