/**
 * See: https://developers.sber.ru/docs/ru/va/reference/smartservices/smartrating/api
 */
import { NLPRequestBody, SharedRequestPayload, NLPResponseATU } from '@salutejs/scenario';
import { PayloadWithDevice } from './request.types';

// CALL_RATING
export type NLPResponseCR = Omit<NLPResponseATU, 'messageName'> & { messageName: 'CALL_RATING' };

// RATING_RESULT
export type NLPRequestRR = NLPRequestBody<'RATING_RESULT', RRPayload & PayloadWithDevice>;
export type RRPayload = SharedRequestPayload & ({
  rating: {
    estimation: number;
  }
  status_code: {
    code: 1,
    description: 'SUCCESS'
  }
} | {
  status_code: { code: 101, description: 'SKIP BY USER' }
} | {
  status_code: { code: 104, description: 'FORBIDDEN' }
})
