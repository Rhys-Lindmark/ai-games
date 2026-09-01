import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { historyQuestions } from '../lib/history.ts';

const serverDirectory = process.env.RELEASE_BUILD_SERVER_DIRECTORY
  ? resolve(process.env.RELEASE_BUILD_SERVER_DIRECTORY)
  : fileURLToPath(new URL('../dist/server/', import.meta.url));
const javascriptFiles = [];

function collectJavascriptFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collectJavascriptFiles(path);
    else if (entry.isFile() && entry.name.endsWith('.js')) javascriptFiles.push(path);
  }
}

try {
  collectJavascriptFiles(serverDirectory);
} catch (error) {
  throw new Error('Release build is missing or unreadable. Run `npm run build` before this check.', { cause: error });
}

assert.ok(javascriptFiles.length > 0, 'Release build must contain server JavaScript');
const bundle = javascriptFiles.map((path) => readFileSync(path, 'utf8')).join('\n');
const missingQuestionIds = historyQuestions
  .map((question) => question.id)
  .filter((id) => !bundle.includes(id));

assert.deepEqual(missingQuestionIds, [], `Release build is stale; missing question IDs: ${missingQuestionIds.join(', ')}`);
assert.match(bundle, /\/how-big-bio/);
assert.doesNotMatch(bundle, /\/games\/games\/how-big-bio/);
assert.doesNotMatch(bundle, /rhyslindmark\.substack\.com\/how-big-bio/);

console.log(`Release build matches source: all ${historyQuestions.length} history IDs and canonical Bio Numbers navigation are packaged`);
