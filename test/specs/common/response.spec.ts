import { AliceResponse } from '../../../src/alice/response';
import data from '../../../data/alice/request.json';

describe('common response', () => {
  let res: AliceResponse;

  beforeEach(() => {
    res = createRes(data) as AliceResponse;
  });

  it('strip all tags from text', () => {
    res.addText([
      'привет<break time="200ms" />',
      '<audio src="url"/><sub alias="щета">счета</sub>.',
    ].join(' '));
    assert.equal(res.body.response.text, 'привет счета.');
  });

});
