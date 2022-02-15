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
  // тайпинги для MESSAGE_TO_SKILL не содержат payload.asr, хотя он приходит
  payload: PayloadAsr;
}
export type NLPRequestСA = NLPRequestСAOrig & {
  // тайпинги для CLOSE_APP не содержат payload.asr, хотя он приходит
  payload: PayloadAsr;
}
export type NLPRequestRA = NLPRequestRAOrig & {
  // тайпинги для RUN_APP не содержат payload.meta, хотя он приходит
  payload: NLPRequestRAOrig & Pick<NLPRequestMTS['payload'], 'meta'>
}
export type SberReqBody = NLPRequestMTS | NLPRequestСA | NLPRequestRA | NLPRequestSA;
export { NLPRequestSA };

interface PayloadAsr {
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
