import { mkdir, writeFile } from 'node:fs/promises';
import { historyQuestions } from '../lib/history.ts';

const outputUrl = new URL('../data/audits/history-source-audit.json', import.meta.url);
const urls = [...new Set(historyQuestions.map((question) => question.sourceUrl))].sort();

function stateFor(status) {
  if (status >= 200 && status < 400) return 'reachable';
  if ([401, 403, 429].includes(status)) return 'access_blocked';
  if ([404, 410].includes(status)) return 'broken';
  if ([408, 425, 500, 502, 503, 504].includes(status)) return 'transient';
  return 'other_http';
}

async function check(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'AI-Games-source-audit/0.1 (+https://ai.rhyslindmark.com/games)' },
    });
    await response.body?.cancel();
    return { url, status: response.status, state: stateFor(response.status), final_url: response.url };
  } catch (error) {
    return { url, status: null, state: 'network_error', error: error instanceof Error ? error.name : 'unknown' };
  }
}

const records = [];
for (let index = 0; index < urls.length; index += 6) {
  records.push(...await Promise.all(urls.slice(index, index + 6).map(check)));
}

const states = Object.fromEntries([...new Set(records.map((record) => record.state))].sort().map((state) => [state, records.filter((record) => record.state === state).length]));
const audit = {
  schema_version: 'ai-games.history-source-audit/0.1.0',
  verified_at: new Date().toISOString().slice(0, 10),
  question_count: historyQuestions.length,
  unique_url_count: urls.length,
  states,
  records,
};

await mkdir(new URL('../data/audits/', import.meta.url), { recursive: true });
await writeFile(outputUrl, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify({ questions: audit.question_count, unique_urls: audit.unique_url_count, states }, null, 2));
