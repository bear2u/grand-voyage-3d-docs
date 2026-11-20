import test from 'node:test';
import assert from 'node:assert/strict';
import { findForbidden } from './check-public-copy.mjs';

test('other game and remake names are rejected', () => {
  for (const word of ['대항해시대', '대항해 시대', 'Koei', 'KOEI', '코에이', 'HD 리메이크', '원작에서는', 'uw2', 'Uncharted Waters', 'AI 부관', '카드게임'])
    assert.ok(findForbidden(`이 문장에는 ${word} 이 들어 있다`).length > 0, word);
});

test('development details are rejected', () => {
  for (const word of ['브랜치', '커밋', '/Users/me', 'Assets/Deepsea/View', 'GameHost.cs', 'Unity'])
    assert.ok(findForbidden(`메모: ${word}`).length > 0, word);
});

test('ordinary guide copy passes', () => {
  assert.deepEqual(findForbidden('Grand Voyage는 3D 항해 게임입니다. 술집에서 선원을 고용하고 항구 관리소에서 물과 식량을 싣습니다.'), []);
  assert.deepEqual(findForbidden('<script>const uw2 = 1;</script><p>마리나 부니치</p>'), []);
});
