/**
 * see: https://yandex.ru/dev/dialogs/alice/doc/speech-tuning.html
 */

/**
 * В Алисе пауза через свой синтаксис: sil <[500]>
 */
const SSML_PAUSE_REGEXP = /<break\s+time="([0-9]+)ms"\s*\/>/ig;
export function convertPause(s: string) {
  return s.replace(SSML_PAUSE_REGEXP, 'sil <[$1]>');
}
