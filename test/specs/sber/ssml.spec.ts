import { SberResponse } from '../../../src/sber/response';
import data from '../../../data/sber/request/message-to-skill.json';

describe('sber ssml ', () => {
  function assertVoice(ssml: string, expected: string) {
    const res = createRes(data) as SberResponse;
    res.addVoice(ssml);
    assert.equal(res.body.payload.pronounceText, expected, ssml);
  }

  it('convert accent', () => {
    assertVoice(
      'удар+ение',
      'ударе\'ние',
    );
  });

  it('convert audio', () => {
    assertVoice(
      'звук <audio src="file.wav"/>',
      'звук <audio text="file.wav"/>',
    );
  });

  it('wrap emotions', () => {
    assertVoice('Ура! В начале строки', '<audio text="Ура!"/> В начале строки');
    assertVoice('В середине угу, строки', 'В середине <audio text="угу"/>, строки');
    assertVoice('В конце строки, м?', 'В конце строки, <audio text="м?"/>');
    // dont wrap
    assertVoice('мура!', 'мура!');
    assertVoice('мой', 'мой');
    assertVoice('Ёой', 'Ёой');
    assertVoice('угу123', 'угу123');
  });

});
