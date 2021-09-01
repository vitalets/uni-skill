import { stripEmoji } from '../../src/utils';

describe('utils.stripEmoji', () => {

  function assertStripEmoji(input: string, expected: string) {
    assert.equal(stripEmoji(input), expected, input);
  }

  it('beginning', () => {
    assertStripEmoji('😊 привет', ' привет');
    assertStripEmoji('😎привет', 'привет');
    assertStripEmoji('😊😎 привет', ' привет');
  });

  it('middle', () => {
    assertStripEmoji('привет 😊 как дела', 'привет. как дела');
    assertStripEmoji('привет 😎, как дела', 'привет, как дела');
  });

  it('end', () => {
    assertStripEmoji('привет😊', 'привет.');
    assertStripEmoji('привет😊😎', 'привет.');
    assertStripEmoji('привет 😇', 'привет.');
    assertStripEmoji('привет! 😈', 'привет!');
    assertStripEmoji('привет!😱', 'привет!');
    assertStripEmoji('привет😺!', 'привет!');
    assertStripEmoji('привет👋 ?', 'привет ?');
  });

  it('compound (consist of two sub emoji)', () => {
    assertStripEmoji('при 👨‍🎓 вет', 'при. вет');
  });
});
