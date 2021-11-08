/**
 * see: https://vk.com/dev/marusia_skill_docs4
 */

export function convertSsmlForMarusya(s: string) {
  return convertAudio(s);
}

/**
 * В Алисе вставка звука через свой тег <speaker>
 */
const SSML_AUDIO_REGEXP = /<audio\s+src="(?<src>[^"]+)"\s*\/>/ig;
function convertAudio(s: string) {
  return s.replace(SSML_AUDIO_REGEXP, (...args) => {
    const { src } = args[args.length - 1];
    // атрибут для встроенных и vk-шных звуков отличается
    const attr = src.startsWith('-') ? 'audio_vk_id' : 'audio';
    return `<speaker ${attr}="${src}">`;
  });
}
