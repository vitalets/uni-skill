import { AliceRequest } from './alice/request';
import { AliceResponse } from './alice/response';
import { MarusyaRequest } from './marusya/request';
import { MarusyaResponse } from './marusya/response';
import { SberRequest } from './sber/request';
import { SberResponse } from './sber/response';
import { AlexaRequest } from './alexa/request';
import { AlexaResponse } from './alexa/response';

export type Request = AliceRequest | MarusyaRequest | SberRequest | AlexaRequest;
export type Response = AliceResponse | MarusyaResponse | SberResponse | AlexaResponse;

export {
  AliceRequest,
  AliceResponse,
  MarusyaRequest,
  MarusyaResponse,
  SberRequest,
  SberResponse,
  AlexaRequest,
  AlexaResponse,
};

export function createRequest(reqBody: unknown) {
  // Important to match Marusya before Alice!
  if (AlexaRequest.match(reqBody)) return new AlexaRequest(reqBody);
  if (MarusyaRequest.match(reqBody)) return new MarusyaRequest(reqBody);
  if (SberRequest.match(reqBody)) return new SberRequest(reqBody);
  if (AliceRequest.match(reqBody)) return new AliceRequest(reqBody);
  throw new Error(`Unsupported platform: ${JSON.stringify(reqBody).substr(0, 200)}`);
}

export function createResponse(request: Request) {
  if (request instanceof AlexaRequest) return new AlexaResponse(request);
  if (request instanceof MarusyaRequest) return new MarusyaResponse(request);
  if (request instanceof SberRequest) return new SberResponse(request);
  if (request instanceof AliceRequest) return new AliceResponse(request);
  throw new Error(`Unsupported platform.`);
}
