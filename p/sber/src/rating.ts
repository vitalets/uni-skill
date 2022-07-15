/**
 * See: https://developers.sber.ru/docs/ru/va/reference/smartservices/smartrating/api
 */
import { NLPRequestBody, SharedRequestPayload, NLPResponseATU } from '@salutejs/scenario';
import { PayloadWithDevice } from './request.types';

// CALL_RATING
export type NLPResponseCR = Omit<NLPResponseATU, 'messageName'> & { messageName: 'CALL_RATING' };

// RATING_RESULT
export type NLPRequestRR = NLPRequestBody<'RATING_RESULT', RRPayload & PayloadWithDevice>;
export type RRPayload = SharedRequestPayload & (RRPayloadSuccess | RRPayloadSkip | RRPayloadForbidden)

export type RRPayloadSuccess = {
  rating: {
    estimation: 1 | 2 | 3 | 4 | 5;
  }
  status_code: {
    code: 1,
    description: 'SUCCESS'
  }
}

export type RRPayloadSkip = {
  status_code: {
    code: 101,
    description: 'SKIP BY USER'
  }
}

export type RRPayloadForbidden = {
  status_code: {
    code: 104,
    description: 'FORBIDDEN'
  }
}
