import chai from 'chai';
import sinon from 'sinon';
import { createRequest, createResponse } from '../src';

type AssertType = typeof chai.assert;
type sinonType = typeof sinon;
type createReqType = typeof createReq;
type createResType = typeof createRes;

declare global {
  const assert: AssertType;
  const sinon: sinonType;
  const createReq: createReqType;
  const createRes: createResType;
}

chai.config.truncateThreshold = 0;

Object.assign(global, {
  assert: chai.assert,
  sinon,
  createReq,
  createRes,
});

afterEach(() => {
  sinon.restore();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createReq(data: unknown, fn?: (data: any) => any) {
  if (fn) {
    data = JSON.parse(JSON.stringify(data));
    fn(data);
  }
  return createRequest(data);
}

function createRes(...args: Parameters<typeof createReq>) {
  return createResponse(createReq(...args));
}
