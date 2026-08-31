import assert from 'node:assert/strict';
import test from 'node:test';
import { bioNumbersDeck, magnitudeFactor, magnitudeScore, scientific } from './how-big.ts';

test('Bio Numbers deck has twelve unique sourced questions spanning molecular to biosphere scale', () => {
  assert.equal(bioNumbersDeck.length, 12);
  assert.equal(new Set(bioNumbersDeck.map((question) => question.id)).size, 12);
  assert.ok(bioNumbersDeck.every((question) => question.value > 0 && question.sourceUrl.startsWith('https://') && question.note.length > 40));
  const exponents = bioNumbersDeck.map((question) => Math.log10(question.value));
  assert.ok(Math.min(...exponents) < -8);
  assert.ok(Math.max(...exponents) > 30);
});

test('scoring halves for every order missed and formatting preserves negative exponents', () => {
  assert.equal(magnitudeScore(6, 1e6), 1000);
  assert.equal(magnitudeScore(5, 1e6), 500);
  assert.equal(magnitudeScore(8, 1e6), 250);
  assert.equal(magnitudeFactor(8, 1e6), 100);
  assert.equal(scientific(2.04e-9), '2 × 10⁻⁹');
  assert.equal(scientific(3e13), '3 × 10¹³');
});
