import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { historyQuestions } from '../lib/history.ts';

const audit = JSON.parse(await readFile(new URL('../data/audits/history-source-audit.json', import.meta.url), 'utf8'));
assert.equal(audit.schema_version, 'ai-games.history-source-audit/0.1.0');
assert.equal(audit.question_count, historyQuestions.length);
assert.equal(audit.unique_url_count, new Set(historyQuestions.map((question) => question.sourceUrl)).size);
const newestQuestionVerification = [...historyQuestions].sort((left, right) => right.verifiedAt.localeCompare(left.verifiedAt))[0].verifiedAt;
assert.ok(audit.verified_at >= newestQuestionVerification, 'audit must be at least as fresh as its newest question');
assert.equal(new Set(audit.records.map((record) => record.url)).size, audit.unique_url_count);
assert.equal(Object.values(audit.states).reduce((sum, count) => sum + count, 0), audit.unique_url_count);
assert.ok(audit.records.every((record) => ['reachable', 'access_blocked', 'broken', 'transient', 'other_http', 'network_error'].includes(record.state)));
assert.equal(audit.records.filter((record) => record.state === 'broken').length, 0, 'history sources include confirmed 404/410 responses');
assert.ok(historyQuestions.every((question) => audit.records.some((record) => record.url === question.sourceUrl)));
console.log(`History source audit: ${audit.unique_url_count} unique URLs checked, zero confirmed broken`);
