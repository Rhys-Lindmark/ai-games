import assert from 'node:assert/strict';
import test from 'node:test';
import { bioNumbersDeck, dailyBioDeck, dailyDayKey, magnitudeFactor, magnitudeScore, scientific, shareCardModel, shareReceipt } from './how-big.ts';

void test('Bio Numbers deck has twelve unique sourced questions spanning molecular to biosphere scale', () => {
  assert.equal(bioNumbersDeck.length, 12);
  assert.equal(new Set(bioNumbersDeck.map((question) => question.id)).size, 12);
  assert.ok(bioNumbersDeck.every((question) => question.value > 0 && question.sourceUrl.startsWith('https://') && question.note.length > 40));
  const exponents = bioNumbersDeck.map((question) => Math.log10(question.value));
  assert.ok(Math.min(...exponents) < -8);
  assert.ok(Math.max(...exponents) > 30);
});

void test('daily selection is stable, bounded, and share receipts reveal no answers', () => {
  assert.equal(dailyDayKey(new Date('2026-08-31T05:30:00Z')), '2026-08-30');
  assert.equal(dailyDayKey(new Date('2026-08-31T07:30:00Z')), '2026-08-31');
  const today = dailyBioDeck(bioNumbersDeck, '2026-08-30');
  assert.deepEqual(today, dailyBioDeck(bioNumbersDeck, '2026-08-30'));
  assert.equal(today.length, 5);
  assert.equal(new Set(today.map((question) => question.id)).size, 5);
  assert.notDeepEqual(today.map((question) => question.id), dailyBioDeck(bioNumbersDeck, '2026-08-31').map((question) => question.id));
  const receipt = shareReceipt('2026-08-30', [1000, 700, 499, 249, 0]);
  assert.match(receipt, /🟩🟨🟧⬛⬛/);
  assert.match(receipt, /2448\/5000/);
  assert.ok(bioNumbersDeck.every((question) => !receipt.includes(String(question.value)) && !receipt.includes(question.id)));
  const card = shareCardModel('2026-08-30', [1000, 700, 499, 249, 0]);
  assert.deepEqual(Object.keys(card), ['schema_version', 'date', 'bands', 'score_total', 'score_max', 'within_one_order']);
  assert.deepEqual(card.bands, ['half_order', 'one_order', 'two_orders', 'farther', 'farther']);
  assert.equal(card.within_one_order, 2);
  assert.ok(!JSON.stringify(card).match(/question|answer|value|source|human-cells/));
});

void test('scoring halves for every order missed and formatting preserves negative exponents', () => {
  assert.equal(magnitudeScore(6, 1e6), 1000);
  assert.equal(magnitudeScore(5, 1e6), 500);
  assert.equal(magnitudeScore(8, 1e6), 250);
  assert.equal(magnitudeFactor(8, 1e6), 100);
  assert.equal(scientific(2.04e-9), '2 × 10⁻⁹');
  assert.equal(scientific(3e13), '3 × 10¹³');
});
