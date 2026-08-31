export type HistoryQuestion = {
  id: string;
  prompt: string;
  year: number;
  min: number;
  max: number;
  difficulty: 'core' | 'survey' | 'specialist';
  detail: string;
  source: string;
  sourceUrl: string;
  verifiedAt: string;
};

export const historyQuestionTarget = 1000;
export const dailyHistoryQuestionCount = 10;

export const historyQuestions: HistoryQuestion[] = [
  { id: 'magna-carta', prompt: 'When was Magna Carta first issued?', year: 1215, min: 1000, max: 1500, difficulty: 'core', detail: 'King John authorized the first Magna Carta at Runnymede in June 1215. Later reissues changed its text and legacy.', source: 'UK Parliament — Magna Carta', sourceUrl: 'https://www.parliament.uk/about/living-heritage/evolutionofparliament/originsofparliament/birthofparliament/overview/magnacarta/', verifiedAt: '2026-08-31' },
  { id: 'ming-dynasty', prompt: 'When did Zhu Yuanzhang establish the Ming dynasty?', year: 1368, min: 1150, max: 1550, difficulty: 'survey', detail: 'Zhu Yuanzhang emerged victorious in 1368, expelled the Yuan court, and ruled as the Hongwu emperor.', source: 'Metropolitan Museum of Art — The Yuan Revolution', sourceUrl: 'https://www.metmuseum.org/exhibitions/listings/2010/yuan-revolution', verifiedAt: '2026-08-31' },
  { id: 'gutenberg-printing', prompt: 'Around when did Gutenberg-era movable-type printing begin in Europe?', year: 1450, min: 1250, max: 1650, difficulty: 'core', detail: 'The date is approximate: historians place the beginning of European typography around 1450, before the Gutenberg Bible was completed.', source: 'Library of Congress — Gutenberg resources', sourceUrl: 'https://guides.loc.gov/gutenberg/resources', verifiedAt: '2026-08-31' },
  { id: 'columbus-caribbean', prompt: 'When did Columbus first reach the Caribbean?', year: 1492, min: 1300, max: 1700, difficulty: 'core', detail: 'Columbus reached the Bahamian island Guanahaní on 12 October 1492, beginning a new phase of European conquest and colonization.', source: 'Library of Congress — Columbus and the Taíno', sourceUrl: 'https://www.loc.gov/exhibits/exploring-the-early-americas/columbus-and-the-taino.html', verifiedAt: '2026-08-31' },
  { id: 'qing-dynasty', prompt: 'When did the Manchus establish Qing rule in China?', year: 1644, min: 1450, max: 1800, difficulty: 'survey', detail: 'The Manchus entered Beijing and established Qing rule in 1644; conquest and consolidation continued for decades.', source: 'Metropolitan Museum of Art — The Qing Dynasty', sourceUrl: 'https://www.metmuseum.org/essays/the-qing-dynasty-1644-1911-painting', verifiedAt: '2026-08-31' },
  { id: 'spinning-jenny', prompt: 'When did James Hargreaves invent the spinning jenny?', year: 1764, min: 1600, max: 1900, difficulty: 'survey', detail: 'Hargreaves is generally credited with inventing the multi-spindle spinning jenny around 1764; he patented a later version in 1770.', source: 'Encyclopaedia Britannica — Spinning jenny', sourceUrl: 'https://www.britannica.com/technology/spinning-jenny', verifiedAt: '2026-08-31' },
  { id: 'watt-patent', prompt: 'When was Watt’s separate-condenser patent granted?', year: 1769, min: 1600, max: 1900, difficulty: 'survey', detail: 'Watt conceived the separate condenser earlier, but this question asks for the patent granted on 5 January 1769.', source: 'Science Museum — James Watt and the separate condenser', sourceUrl: 'https://blog.sciencemuseum.org.uk/james-watt-and-the-separate-condenser/', verifiedAt: '2026-08-31' },
  { id: 'french-revolution', prompt: 'When did the French Revolution begin?', year: 1789, min: 1650, max: 1950, difficulty: 'core', detail: 'This uses 1789, the year of the Estates-General, the National Assembly, and the storming of the Bastille, as the conventional start.', source: 'U.S. National Archives — Onset of the French Revolution', sourceUrl: 'https://www.archives.gov/exhibits/eyewitness/html.php?section=1', verifiedAt: '2026-08-31' },
  { id: 'haitian-independence', prompt: 'When did Haiti declare independence from France?', year: 1804, min: 1650, max: 1950, difficulty: 'survey', detail: 'Haitian generals signed the declaration on 1 January 1804 after a thirteen-year revolution against slavery and colonial rule.', source: 'Library of Congress — Ayiti Reimagined', sourceUrl: 'https://guides.loc.gov/haiti-reimagined', verifiedAt: '2026-08-31' },
  { id: 'telegraph', prompt: 'When was a practical electric telegraph first demonstrated in Britain?', year: 1837, min: 1700, max: 2000, difficulty: 'specialist', detail: 'Cooke and Wheatstone demonstrated their five-needle electric telegraph to railway directors in 1837.', source: 'Science Museum — Cooke and Wheatstone telegraph', sourceUrl: 'https://blog.sciencemuseum.org.uk/revealing-the-real-cooke-and-wheatstone-telegraph-dial/', verifiedAt: '2026-08-31' },
  { id: 'meiji-restoration', prompt: 'When did the Meiji Restoration change Japan’s regime?', year: 1868, min: 1700, max: 2000, difficulty: 'survey', detail: 'Imperial rule was proclaimed in January 1868, beginning the new Meiji government and a far-reaching transformation of Japan.', source: 'National Diet Library of Japan — Meiji government', sourceUrl: 'https://www.ndl.go.jp/portrait/e/pickup/012/', verifiedAt: '2026-08-31' },
  { id: 'indian-independence', prompt: 'When did British rule end in India?', year: 1947, min: 1800, max: 2020, difficulty: 'core', detail: 'British India was partitioned into India and Pakistan in August 1947; independence and partition unfolded together.', source: 'UK National Archives — Indian Independence', sourceUrl: 'https://www.nationalarchives.gov.uk/education/resources/indian-independence/', verifiedAt: '2026-08-31' },
  { id: 'berlin-wall-fall', prompt: 'When did the Berlin Wall fall?', year: 1989, min: 1900, max: 2020, difficulty: 'core', detail: 'East Germany opened the border on 9 November 1989. Formal German reunification followed in October 1990.', source: 'German Bundestag — 1989–1990', sourceUrl: 'https://www.bundestag.de/resource/blob/480634/exhibition_dome.pdf', verifiedAt: '2026-08-31' },
];

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return result >>> 0;
}

export function dailyHistoryDeck(dayKey: string, questions = historyQuestions) {
  return [...questions].sort((left, right) => hash(`${dayKey}:${left.id}`) - hash(`${dayKey}:${right.id}`)).slice(0, Math.min(dailyHistoryQuestionCount, questions.length));
}

export function historyPoints(guess: number, answer: number) {
  const distance = Math.abs(guess - answer);
  if (distance === 0) return 1000;
  if (distance <= 2) return 900;
  if (distance <= 5) return 800;
  if (distance <= 10) return 650;
  if (distance <= 25) return 500;
  if (distance <= 50) return 300;
  if (distance <= 100) return 150;
  return 0;
}

export function historyLevel(scores: number[]) {
  const average = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  if (average >= 900) return { name: 'PhD-level round', note: 'Nearly exact across the whole set.' };
  if (average >= 750) return { name: 'Graduate seminar', note: 'Excellent chronology, including the harder dates.' };
  if (average >= 600) return { name: 'History undergraduate', note: 'Strong command of the broad timeline.' };
  if (average >= 450) return { name: '10th-grade history', note: 'The major eras are in place.' };
  if (average >= 300) return { name: '7th-grade history', note: 'A useful timeline is taking shape.' };
  return { name: '3rd-grade history', note: 'Start with the big anchors and play again tomorrow.' };
}
