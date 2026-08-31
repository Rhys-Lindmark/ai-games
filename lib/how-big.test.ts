import assert from 'node:assert/strict';
import test from 'node:test';
import { bioNumbersDeck, dailyBioDeck, magnitudeFactor, magnitudeScore, scientific, shareReceipt } from './how-big.ts';

test('Bio Numbers deck has twelve unique sourced questions spanning molecular to biosphere scale', () => {
  assert.equal(bioNumbersDeck.length, 12);
  assert.equal(new Set(bioNumbersDeck.map((question) => question.id)).size, 12);
  assert.ok(bioNumbersDeck.every((question) => question.value > 0 && question.sourceUrl.startsWith('https://') && question.note.length > 40));
  const exponents = bioNumbersDeck.map((question) => Math.log10(question.value));
  assert.ok(Math.min(...exponents) < -8);
  assert.ok(Math.max(...exponents) > 30);
});

test('daily selection is stable, bounded, and share receipts reveal no answers', () => {
  const today = dailyBioDeck(bioNumbersDeck, '2026-08-30');
  assert.deepEqual(today, dailyBioDeck(bioNumbersDeck, '2026-08-30'));
  assert.equal(today.length, 5);
  assert.equal(new Set(today.map((question) => question.id)).size, 5);
  assert.notDeepEqual(today.map((question) => question.id), dailyBioDeck(bioNumbersDeck, '2026-08-31').map((question) => question.id));
  const receipt = shareReceipt('2026-08-30', [1000, 700, 499, 249, 0]);
  assert.match(receipt, /🟩🟨🟧⬛⬛/);
  assert.match(receipt, /2448\/5000/);
  assert.ok(bioNumbersDeck.every((question) => !receipt.includes(String(question.value)) && !receipt.includes(question.id)));
});

test('scoring halves for every order missed and formatting preserves negative exponents', () => {
  assert.equal(magnitudeScore(6, 1e6), 1000);
  assert.equal(magnitudeScore(5, 1e6), 500);
  assert.equal(magnitudeScore(8, 1e6), 250);
  assert.equal(magnitudeFactor(8, 1e6), 100);
  assert.equal(scientific(2.04e-9), '2 × 10⁻⁹');
  assert.equal(scientific(3e13), '3 × 10¹³');
});
