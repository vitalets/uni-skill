/**
 * see: https://developer.sberdevices.ru/docs/ru/developer_tools/ssml/supported_characters
 */

export function convertSsmlForSber(s: string) {
  return convertAccents(s);
}

/**
 * В сбере ударения делаются через апостроф.
 */
const ACCENT_REGEXP = /\+([аяоёэеиыую])/ig;
function convertAccents(s: string) {
  return s.replace(ACCENT_REGEXP, '$1\'');
}
