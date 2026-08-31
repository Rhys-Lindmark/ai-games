import assert from 'node:assert/strict';
import test from 'node:test';
import { dailyHistoryDeck, dailyHistoryQuestionCount, formatHistoryYear, historyLevel, historyPoints, historyQuestions, historyQuestionTarget } from './history.ts';

void test('history library begins a sourced 1,000-question curriculum', () => {
  assert.equal(historyQuestionTarget, 1000);
  assert.equal(historyQuestions.length, 43);
  assert.equal(new Set(historyQuestions.map((question) => question.id)).size, historyQuestions.length);
  assert.equal(new Set(historyQuestions.map((question) => question.prompt)).size, historyQuestions.length);
  assert.ok(historyQuestions.every((question) => question.year >= question.min && question.year <= question.max));
  assert.ok(historyQuestions.every((question) => Number.isInteger(question.year) && question.prompt.endsWith('?') && question.detail.length >= 80));
  assert.ok(historyQuestions.every((question) => question.sourceUrl.startsWith('https://') && question.verifiedAt === '2026-08-31'));
  for (const difficulty of ['core', 'survey', 'specialist']) {
    assert.ok(historyQuestions.filter((question) => question.difficulty === difficulty).length >= 5, `${difficulty} needs meaningful representation`);
  }
});

void test('ancient dates are shown as human BCE/CE labels', () => {
  assert.equal(formatHistoryYear(-2780), '2,780 BCE');
  assert.equal(formatHistoryYear(-27), '27 BCE');
  assert.equal(formatHistoryYear(79), '79 CE');
  assert.equal(formatHistoryYear(0), 'BCE / CE');
});

void test('daily round is ten stable unique questions and rotates by day', () => {
  const today = dailyHistoryDeck('2026-08-31');
  assert.equal(today.length, dailyHistoryQuestionCount);
  assert.equal(new Set(today.map((question) => question.id)).size, dailyHistoryQuestionCount);
  assert.deepEqual(today, dailyHistoryDeck('2026-08-31'));
  assert.notDeepEqual(today.map((question) => question.id), dailyHistoryDeck('2026-09-01').map((question) => question.id));
});

void test('points and playful academic levels reward chronological precision', () => {
  assert.equal(historyPoints(1492, 1492), 1000);
  assert.equal(historyPoints(1500, 1492), 650);
  assert.equal(historyPoints(1600, 1492), 0);
  assert.equal(historyLevel(Array(10).fill(1000)).name, 'PhD-level round');
  assert.equal(historyLevel(Array(10).fill(650)).name, 'History undergraduate');
  assert.equal(historyLevel(Array(10).fill(150)).name, '3rd-grade history');
});
