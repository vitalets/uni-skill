export function concatWithSeparator(s1: string | undefined, s2: string | undefined, separator: string) {
  return [ s1, s2 ]
    .filter(text => typeof text === 'string' && text.length > 0)
    .join(separator);
}

export function concatWithNewline(s1: string | undefined, s2: string | undefined) {
  return concatWithSeparator(s1, s2, '\n');
}

export function stripSpeakTags(s?: string) {
  return s ? s.replace(/<\/?speak>/gi, '').trim() : s;
}

/**
 * Strip emoji from speach as they pronounced without pauses.
 * If there are punctuation next to emoji, delete emoji, otherwist replace emoji with ".".
 * see: https://stackoverflow.com/questions/43242440/javascript-unicode-emoji-regular-expressions
 */
// eslint-disable-next-line max-len
const STRIP_EMOJI_REGEXP = /(?<p1>[.,!?>]+)?(?<space1>\s+)?[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}\u{200d}]{1,4}(?<space2>\s+)?(?<p2>[.,!?]+)?/ug;
export function stripEmoji(s?: string) {
  if (typeof s !== 'string') return s;
  return s.replace(STRIP_EMOJI_REGEXP, (...args) => {
    const l = args.length;
    const { p1 = '', p2 = '', space2 = '' } = args[l - 1];
    const pos = args[l - 3];
    return `${p1}${p1 || p2 || pos === 0 ? '' : '.'}${space2}${p2}`;
  });
}
