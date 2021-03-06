/**
 * see: https://yandex.ru/dev/dialogs/alice/doc/speech-tuning.html
 */

export function convertSsmlForAlice(s: string) {
  return convertAudio(convertPause(s));
}

/**
 * В Алисе пауза через свой синтаксис. Поэтому меняем:
 * '<break time="1s"/>' -> 'sil <[1000]>'
 * '<break time="1000ms"/>' -> 'sil <[1000]>'
 */
const SSML_PAUSE_REGEXP = /<break(\s+time="(?<time>[0-9]+)(?<unit>ms|s)")?\s*\/>/ig;
const DEFAULT_PAUSE_TIME = 500;
function convertPause(s: string) {
  return s.replace(SSML_PAUSE_REGEXP, (...args) => {
    const { time, unit } = args[args.length - 1];
    const ms = time
      ? Number(time) * (unit === 's' ? 1000 : 1)
      : DEFAULT_PAUSE_TIME;
    return `sil <[${ms}]>`;
  });
}

/**
 * В Алисе вставка звука через свой тег <speaker>.
 * Поэтому меняем: '<audio src="file.mp3"/>' на '<speaker audio="file.mp3">'
 */
const SSML_AUDIO_REGEXP = /<audio\s+src="([^"]+)"\s*\/>/ig;
function convertAudio(s: string) {
  return s.replace(SSML_AUDIO_REGEXP, '<speaker audio="$1">');
}
