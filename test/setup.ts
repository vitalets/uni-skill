import chai from 'chai';
import sinon from 'sinon';

type AssertType = typeof chai.assert;
type sinonType = typeof sinon;
type patchType = typeof patch;

declare global {
  const assert: AssertType;
  const sinon: sinonType;
  const patch: patchType;
}

chai.config.truncateThreshold = 0;

Object.assign(global, {
  assert: chai.assert,
  sinon,
  patch,
});

afterEach(() => {
  sinon.restore();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patch(data: unknown, fn: (data: any) => any) {
  const newData = JSON.parse(JSON.stringify(data));
  fn(newData);
  return newData;
}
