/**
 * В @salutejs/types некоторые поля отсутствуют, поэтому добавляем тут.
 * todo: https://github.com/sberdevices/salutejs/issues/250
 * todo: https://github.com/sberdevices/salutejs/issues/259
 */
import {
  NLPRequestMTS as NLPRequestMTSOrig,
  NLPRequestСA as NLPRequestСAOrig,
  NLPRequestRA as NLPRequestRAOrig,
  NLPRequestSA
} from '@salutejs/types';

export type NLPRequestMTS = NLPRequestMTSOrig & {
  payload: PayloadWithAsr & PayloadWithMeta;
}
export type NLPRequestСA = NLPRequestСAOrig & {
  payload: PayloadWithAsr;
}
export type NLPRequestRA = NLPRequestRAOrig & {
  payload: PayloadWithAsr & PayloadWithMeta;
}
export type SberReqBody = NLPRequestMTS | NLPRequestСA | NLPRequestRA | NLPRequestSA;
export { NLPRequestSA };

// тайпинги для RUN_APP не содержат payload.meta, хотя он приходит
interface PayloadWithMeta {
  meta?: NLPRequestMTSOrig['payload']['meta'] & MetaFeatures;
}

// тайпинги для MESSAGE_TO_SKILL, CLOSE_APP, RUN_APP не содержат payload.asr, хотя он приходит
interface PayloadWithAsr {
  asr: {
    hypotheses?: Hypothese[]
  }
}

interface Hypothese {
  words: string;
  normalizedText: string;
  extendedWords: HypotheseExtendedWord[];
}

interface HypotheseExtendedWord {
  tokenType: number;
  token: string;
}

// meta.features не типизировано
interface MetaFeatures {
  features: {
    screen: {
      enabled: boolean;
    }
  }
}
