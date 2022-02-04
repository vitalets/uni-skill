import { handleAppeal, handleGender, handleRespeech } from '../../src/respeech';

describe('respeech', () => {

  function assertEqualFn(fn: () => string, expected: string) {
    assert.equal(fn(), expected, String(fn));
  }

  it('handleRespeech', () => {
    assertEqualFn(
      () => handleRespeech('Я думал[а] {ты|вы} {знаешь|знаете}', { isOfficial: false, isMale: true }),
      'Я думал ты знаешь'
    );
  });

  describe('ты/вы', () => {
    it('длинный синтакс', () => {
      assertEqualFn(() => handleAppeal('{Ты|Вы} так {думаешь|думаете}?', { isOfficial: false }), 'Ты так думаешь?');
      assertEqualFn(() => handleAppeal('{Ты|Вы} так {думаешь|думаете}?', { isOfficial: true }), 'Вы так думаете?');
    });

    it('длинный синтакс, только ты', () => {
      assertEqualFn(() => handleAppeal('фраза с {только ты|}', { isOfficial: false }), 'фраза с только ты');
      assertEqualFn(() => handleAppeal('фраза с {только ты|}', { isOfficial: true }), 'фраза с ');
    });

    it('длинный синтакс, только вы', () => {
      assertEqualFn(() => handleAppeal('фраза с {|только вы}', { isOfficial: false }), 'фраза с ');
      assertEqualFn(() => handleAppeal('фраза с {|только вы}', { isOfficial: true }), 'фраза с только вы');
    });

    it('сокращ. синтакс', () => {
      assertEqualFn(() => handleAppeal('давай{те} начнём', { isOfficial: false }), 'давай начнём');
      assertEqualFn(() => handleAppeal('давай{те} начнём', { isOfficial: true }), 'давайте начнём');
    });
  });

  describe('пол ассистента', () => {
    it('длинный синтакс', () => {
      assertEqualFn(() => handleGender('Я [думал|думала] так', { isMale: false }), 'Я думала так');
      assertEqualFn(() => handleGender('Я [думал|думала] так', { isMale: true }), 'Я думал так');
    });

    it('длинный синтакс, только М', () => {
      assertEqualFn(() => handleGender('фраза с [только м|]', { isMale: false }), 'фраза с ');
      assertEqualFn(() => handleGender('фраза с [только м|]', { isMale: true }), 'фраза с только м');
    });

    it('длинный синтакс, только Ж', () => {
      assertEqualFn(() => handleGender('фраза с [|только ж]', { isMale: false }), 'фраза с только ж');
      assertEqualFn(() => handleGender('фраза с [|только ж]', { isMale: true }), 'фраза с ');
    });

    it('сокращ. синтакс', () => {
      assertEqualFn(() => handleGender('Я думал[а]', { isMale: false }), 'Я думала');
      assertEqualFn(() => handleGender('Я думал[а]', { isMale: true }), 'Я думал');
    });
  });

});
