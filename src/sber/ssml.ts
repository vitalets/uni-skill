/**
 * see: https://developer.sberdevices.ru/docs/ru/developer_tools/ssml/supported_characters
 */

export function handleAccents(s: string) {
  return s.replace(/\+([аяоёэеиыую])/ig, '$1\'');
}
