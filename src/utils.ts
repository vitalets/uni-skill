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
