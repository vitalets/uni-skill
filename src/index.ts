import { AliceRequest } from './alice/request';
import { AliceResponse } from './alice/response';
import { MarusyaRequest } from './marusya/request';
import { MarusyaResponse } from './marusya/response';
import { SberRequest } from './sber/request';
import { SberResponse } from './sber/response';

export type Request = AliceRequest | MarusyaRequest | SberRequest;
export type Response = AliceResponse | MarusyaResponse | SberResponse;

export function createRequest(reqBody: unknown) {
  // Important to match Marusya first!
  if (MarusyaRequest.match(reqBody)) {
    return new MarusyaRequest(reqBody);
  } else if (AliceRequest.match(reqBody)) {
    return new AliceRequest(reqBody);
  } else if (SberRequest.match(reqBody)) {
    return new SberRequest(reqBody);
  } else {
    throw new Error(`Unsupported platform: ${JSON.stringify(reqBody).substr(0, 200)}`);
  }
}

export function createResponse(request: Request) {
  if (request instanceof AliceRequest) {
    return new AliceResponse();
  } else if (request instanceof MarusyaRequest) {
    return new MarusyaResponse(request);
  } else if (request instanceof SberRequest) {
    return new SberResponse(request);
  } else {
    throw new Error(`Unsupported platform.`);
  }
}
