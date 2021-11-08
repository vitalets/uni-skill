import { MarusyaRequest } from '../src';

type createRequest = typeof createRequest;
type createResponse = typeof createResponse;

declare global {
  const createRequest: createRequest;
  const createResponse: createResponse;
}

Object.assign(global, {
  createRequest,
  createResponse,
});

function createRequest(data: unknown) {
  return MarusyaRequest.create(data)!;
}

function createResponse(data: unknown) {
  return createRequest(data).createResponse();
}
