/**
 * see: https://developer.sberdevices.ru/docs/ru/developer_tools/ssml/supported_characters
 */

/**
 * В сбере ударения делаются через апостроф.
 */
export function convertAccents(s: string) {
  return s.replace(/\+([аяоёэеиыую])/ig, '$1\'');
}
