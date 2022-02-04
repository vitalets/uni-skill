/**
 * Специальный синтакс реплик ассистента для указания ты/вы и учета пола ассистента.
 *
 * Note: была идея сделать это отденльнвм проектом в экосистеме https://unifiedjs.com/, но руки не дошли,
 * поэтому пока так.
 */

export interface RespeechParams {
  isOfficial: boolean;
  isMale: boolean;
}

export function handleRespeech(text: string | undefined, params: RespeechParams) {
  let resText = text || '';
  resText = handleAppeal(resText, { isOfficial: params.isOfficial });
  resText = handleGender(resText, { isMale: params.isMale });
  return resText;
}

/**
 * Автоматическая подстановка ты/вы.
 * Шаблон: {ты|вы} и (сокращенно) давай{те}
 */
const APPEAL_FULL_REGEXP = /\{(?<unofficial>[^}]*)\|(?<official>[^}]*)\}/ig;
const APPEAL_SHORT_REGEXP = /(?<letter>[а-яё])\{(?<official>[^}]+)\}/ig;
export function handleAppeal(text: string | undefined, { isOfficial }: Pick<RespeechParams, 'isOfficial'>) {
  return (text || '')
    .replace(APPEAL_FULL_REGEXP, (...args) => {
      const { unofficial = '', official = '' } = args[args.length - 1];
      return isOfficial ? official : unofficial;
    })
    .replace(APPEAL_SHORT_REGEXP, (...args) => {
      const { letter = '', official = '' } = args[args.length - 1];
      return `${letter}${isOfficial ? official : ''}`;
    });
}

/**
 * Автоматическая подстановка текста под пол ассистента.
 * Шаблон: [м|ж] и (сокращенно) слышал[а]
 */
const GENDER_FULL_REGEXP = /\[(?<male>[^\]]*)\|(?<female>[^\]]*)\]/ig;
const GENDER_SHORT_REGEXP = /(?<letter>[а-яё])\[(?<female>[^\]]+)\]/ig;
export function handleGender(text: string | undefined, { isMale }: Pick<RespeechParams, 'isMale'>) {
  return (text || '')
    .replace(GENDER_FULL_REGEXP, (...args) => {
      const { male = '', female = '' } = args[args.length - 1];
      return isMale ? male : female;
    })
    .replace(GENDER_SHORT_REGEXP, (...args) => {
      const { letter = '', female = '' } = args[args.length - 1];
      return `${letter}${isMale ? '' : female}`;
    });
}
