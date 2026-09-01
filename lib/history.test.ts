import assert from 'node:assert/strict';
import test from 'node:test';
import { dailyHistoryDeck, dailyHistoryQuestionCount, formatHistoryYear, historyLevel, historyPoints, historyQuestions, historyQuestionTarget, parseHistoryGuess } from './history.ts';

void test('history library begins a sourced 1,000-question curriculum', () => {
  assert.equal(historyQuestionTarget, 1000);
  assert.equal(historyQuestions.length, 143);
  assert.equal(new Set(historyQuestions.map((question) => question.id)).size, historyQuestions.length);
  assert.equal(new Set(historyQuestions.map((question) => question.prompt)).size, historyQuestions.length);
  assert.ok(historyQuestions.every((question) => question.year >= question.min && question.year <= question.max));
  assert.ok(historyQuestions.every((question) => Number.isInteger(question.year) && question.prompt.endsWith('?') && question.detail.length >= 80));
  assert.ok(historyQuestions.every((question) => question.sourceUrl.startsWith('https://') && question.verifiedAt === '2026-08-31'));
  for (const difficulty of ['core', 'survey', 'specialist']) {
    assert.ok(historyQuestions.filter((question) => question.difficulty === difficulty).length >= 5, `${difficulty} needs meaningful representation`);
  }
  const scienceAndTechnologyBatch = [
    'stockton-darlington-railway',
    'mendeleev-periodic-table',
    'wright-first-flight',
    'fleming-penicillin',
    'dna-double-helix',
    'sputnik-1',
    'apollo-11-moon-landing',
    'smallpox-eradication',
    'human-genome-project-complete',
    'crispr-cas9-genome-editing',
  ];
  assert.ok(scienceAndTechnologyBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const medicineAndPublicHealthBatch = [
    'jenner-smallpox-vaccination',
    'ether-anesthesia-demonstration',
    'lister-antiseptic-surgery',
    'roentgen-x-rays',
    'insulin-discovery',
    'salk-polio-vaccine',
    'first-human-heart-transplant',
    'first-ivf-birth',
    'hiv-isolated-identified',
    'first-covid-vaccine-doses',
  ];
  assert.ok(medicineAndPublicHealthBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const globalPremodernBatch = [
    'uruk-first-city',
    'mature-harappan-cities',
    'shang-dynasty',
    'chavin-culture',
    'zhou-conquest',
    'han-dynasty-begins',
    'yijing-srivijaya',
    'khmer-empire-802',
    'great-zimbabwe-building',
    'tenochtitlan-founded',
  ];
  assert.ok(globalPremodernBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const navigationAndExchangeBatch = [
    'lanse-aux-meadows',
    'maori-settlement-aotearoa',
    'zheng-he-first-voyage',
    'dias-cape-good-hope',
    'vasco-da-gama-calicut',
    'first-circumnavigation-complete',
    'manila-galleon-route',
    'voc-founded',
    'tasman-pacific-voyage',
    'cook-first-pacific-voyage',
  ];
  assert.ok(navigationAndExchangeBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const rightsRevolutionAndIndependenceBatch = [
    'english-bill-of-rights',
    'us-declaration-independence',
    'haitian-revolution-begins',
    'mexican-independence-uprising',
    'brazil-independence',
    'british-slavery-abolition-act',
    'bolshevik-revolution',
    'ghana-independence',
    'bangladesh-independence-war',
    'south-africa-democratic-election',
  ];
  assert.ok(rightsRevolutionAndIndependenceBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const internationalOrderBatch = [
    'league-of-nations-begins',
    'un-charter-signed',
    'udhr-adopted',
    'korean-armistice',
    'bandung-conference',
    'treaties-of-rome',
    'cuban-missile-crisis',
    'maastricht-treaty-signed',
    'african-union-launched',
    'paris-agreement-adopted',
  ];
  assert.ok(internationalOrderBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const globalEconomyBatch = [
    'bank-of-england-founded',
    'bretton-woods-conference',
    'imf-begins-operations',
    'world-bank-first-loan',
    'gatt-signed',
    'opec-founded',
    'us-gold-window-closed',
    'wto-begins',
    'euro-launched',
    'china-joins-wto',
  ];
  assert.ok(globalEconomyBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const ancientEarlyMedievalBatch = [
    'stonehenge-central-stones',
    'caral-organized-system',
    'meroe-royal-residence',
    'jenne-jeno-first-occupation',
    'roman-empire-maximum-trajan',
    'justinian-law-compilation',
    'sui-reunification',
    'goryeo-reunification',
    'monte-alban-founded',
    'chaco-great-houses',
  ];
  assert.ok(ancientEarlyMedievalBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const lowDensityCenturiesBatch = [
    'nara-permanent-capital',
    'umayyad-landing-iberia',
    'abbasid-overthrow-umayyads',
    'an-lushan-rebellion-begins',
    'northern-song-begins',
    'chichen-itza-maya-toltec-phase',
    'cairo-founded-fatimid-capital',
    'angkor-wat-building-phase',
    'lalibela-reign-begins',
    'saladin-retakes-jerusalem',
  ];
  assert.ok(lowDensityCenturiesBatch.every((id) => historyQuestions.some((question) => question.id === id)));
  const lateAntiquityCorrectionBatch = [
    'moche-urban-centers',
    'cai-lun-paper-report',
    'antonine-plague-begins',
    'yellow-turban-uprising',
    'han-dynasty-ends',
    'sasanian-empire-begins',
    'tikal-first-lowland-long-count',
    'edict-of-milan',
    'ezana-converts-aksum',
    'visigoth-sack-rome',
  ];
  assert.ok(lateAntiquityCorrectionBatch.every((id) => historyQuestions.some((question) => question.id === id)));
});

void test('ancient dates are shown as human BCE/CE labels', () => {
  assert.equal(formatHistoryYear(-2780), '2,780 BCE');
  assert.equal(formatHistoryYear(-27), '27 BCE');
  assert.equal(formatHistoryYear(79), '79 CE');
  assert.equal(formatHistoryYear(0), 'BCE / CE');
});

void test('typed history guesses require a whole positive year and apply the selected era', () => {
  assert.equal(parseHistoryGuess(' 1492 ', 'CE'), 1492);
  assert.equal(parseHistoryGuess('776', 'BCE'), -776);
  assert.equal(parseHistoryGuess('', 'CE'), null);
  assert.equal(parseHistoryGuess('0', 'CE'), null);
  assert.equal(parseHistoryGuess('-490', 'BCE'), null);
  assert.equal(parseHistoryGuess('1868.5', 'CE'), null);
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
