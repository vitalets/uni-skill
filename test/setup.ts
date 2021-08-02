import chai from 'chai';
import sinon from 'sinon';
import { createRequest, createResponse } from '../src';

type AssertType = typeof chai.assert;
type sinonType = typeof sinon;
type createRequestType = typeof createRequest;
type createResponseType = typeof createResponse;

declare global {
  const assert: AssertType;
  const sinon: sinonType;
  const createRequest: createRequestType;
  const createResponse: createResponseType;
}

chai.config.truncateThreshold = 0;

Object.assign(global, {
  assert: chai.assert,
  sinon,
  createRequest,
  createResponse,
});

afterEach(() => {
  sinon.restore();
});

