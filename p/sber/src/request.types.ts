/**
 * В тайпингах @salutejs некоторые поля отсутствуют, поэтому добавляем тут.
 * todo: https://github.com/sberdevices/salutejs/issues/250
 * todo: https://github.com/sberdevices/salutejs/issues/259
 */
import {
  NLPRequestMTS as NLPRequestMTSOrig,
  NLPRequestСA as NLPRequestСAOrig,
  NLPRequestRA as NLPRequestRAOrig,
  NLPRequestSA,
  Device
} from '@salutejs/scenario';
import { NLPRequestRR } from './rating';

// MESSAGE_TO_SKILL
export type NLPRequestMTS = NLPRequestMTSOrig & {
  payload: PayloadWithAsr & PayloadWithMeta & PayloadWithDevice;
}

// CLOSE_APP
export type NLPRequestСA = NLPRequestСAOrig & {
  payload: PayloadWithAsr & PayloadWithDevice;
}

// RUN_APP
export type NLPRequestRA = NLPRequestRAOrig & {
  payload: PayloadWithAsr & PayloadWithMeta & PayloadWithDevice;
}

// SERVER_ACTION, RATING_RESPONSE
export { NLPRequestSA, NLPRequestRR };

export type SberReqBody = NLPRequestMTS | NLPRequestСA | NLPRequestRA | NLPRequestSA | NLPRequestRR;

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

// Поле device в какой-то момент сделали опциональным для всех типов сообщений.
// А нужно четко поделить, когда оно приходит, когда нет.
export interface PayloadWithDevice {
  device: Device
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
