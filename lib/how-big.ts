export type MagnitudeQuestion = {
  id: string;
  prompt: string;
  value: number;
  unit: string;
  source: string;
  sourceUrl: string;
  note: string;
};

export const bioNumbersDeck: MagnitudeQuestion[] = [
  { id: 'human-cells', prompt: 'Human cells in a 70 kg adult man?', value: 3e13, unit: 'human cells', source: 'BioNumbers BNID 113006', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=113006', note: 'Uses the 2016 revised estimate for a reference 70 kg adult man. About 70% of the counted cells are red blood cells.' },
  { id: 'dna-diameter', prompt: 'Diameter of the DNA double helix, in meters?', value: 2.04e-9, unit: 'meters', source: 'BioNumbers BNID 105243', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105243', note: 'Uses the 20.4 Å fiber-diffraction diameter of B-form DNA. A hydration shell makes the effective diameter slightly larger.' },
  { id: 'ecoli-proteins', prompt: 'Protein molecules in one E. coli cell?', value: 3.5e6, unit: 'proteins', source: 'BioNumbers BNID 115702', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115702', note: 'Uses a 3–4 million estimate for a roughly 1 µm³ E. coli cell; growth conditions and cell volume move the answer.' },
  { id: 'biosphere-prokaryotes', prompt: 'Prokaryotic cells in Earth’s biosphere?', value: 5e30, unit: 'cells', source: 'BioNumbers BNID 111607', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111607', note: 'A 2015 biosphere estimate. It is a model-derived global order of magnitude, not a literal census.' },
  { id: 'human-genome', prompt: 'Base pairs in one copy of the human genome?', value: 3e9, unit: 'base pairs', source: 'NHGRI — Base Pair', sourceUrl: 'https://www.genome.gov/genetics-glossary/Base-Pair', note: 'Counts one haploid copy. Most human cells are diploid and therefore carry roughly two copies.' },
  { id: 'daily-atp', prompt: 'ATP mass resynthesized by an adult each day?', value: 60, unit: 'kilograms', source: 'BioNumbers BNID 105606', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105606', note: 'A resting-day estimate near one body weight of ATP. Activity and metabolic assumptions move the total.' },
  { id: 'brain-neurons', prompt: 'Neurons in an adult human brain?', value: 8.6e10, unit: 'neurons', source: 'Azevedo et al. 2009 table', sourceUrl: 'https://bionumbers.hms.harvard.edu/files/Expected%20values%20for%20a%20generic%20rodent%20and%20primate%20brains%20of%201.5%20kg%2C%20and%20values%20observed%20for%20the%20human%20brain.pdf', note: 'Uses the isotropic-fractionator estimate of 86 billion; this is a population-scale estimate, not an exact individual count.' },
  { id: 'human-genes', prompt: 'Protein-coding genes in the human genome?', value: 2e4, unit: 'genes', source: 'NHGRI — DNA Fact Sheet', sourceUrl: 'https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet', note: 'Uses the rounded modern count of about 20,000 protein-coding genes; the number depends on annotation rules.' },
  { id: 'body-bacteria', prompt: 'Bacterial cells in the reference human body?', value: 3.8e13, unit: 'bacterial cells', source: 'BioNumbers BNID 113006', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=113006', note: 'The revised estimate is near 1:1 with human cells, replacing the old 10:1 rule of thumb.' },
  { id: 'yeast-proteins', prompt: 'Protein molecules in a haploid yeast cell?', value: 5e7, unit: 'proteins', source: 'BioNumbers BNID 106198', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106198', note: 'A mass-derived estimate around 50 million, with published estimates spanning roughly 30–80 million.' },
  { id: 'ecoli-genome', prompt: 'Base pairs in the E. coli genome?', value: 5e6, unit: 'base pairs', source: 'NHGRI — Sequencing cost', sourceUrl: 'https://www.genome.gov/about-genomics/fact-sheets/Sequencing-Human-Genome-cost', note: 'Uses NHGRI’s rounded ~5 million-base comparison; strain-specific genomes differ.' },
  { id: 'red-blood-cells', prompt: 'Red blood cells in an adult human?', value: 2.6e13, unit: 'red blood cells', source: 'BioNumbers BNID 102741', sourceUrl: 'https://bionumbers.hms.harvard.edu/bionumber.aspx?id=102741', note: 'Uses the middle of a 2.2–3.3×10¹³ adult range; body size, sex, and blood volume matter.' },
];

export const magnitudeScore = (guessExponent: number, value: number) => Math.round(1000 * 0.5 ** Math.abs(guessExponent - Math.log10(value)));
export const magnitudeFactor = (guessExponent: number, value: number) => 10 ** Math.abs(guessExponent - Math.log10(value));

export function dailyDayKey(date = new Date(), timeZone = 'America/Los_Angeles') {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function dailyBioDeck(deck: MagnitudeQuestion[], dayKey: string, count = 5) {
  let seed = Array.from(dayKey).reduce((value, char) => Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0, 2166136261);
  const shuffled = [...deck];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const target = seed % (index + 1);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export type ScoreBandName = 'half_order' | 'one_order' | 'two_orders' | 'farther';
export const scoreBandName = (score: number): ScoreBandName => score >= 708 ? 'half_order' : score >= 500 ? 'one_order' : score >= 250 ? 'two_orders' : 'farther';
const scoreBandSymbol: Record<ScoreBandName, string> = { half_order: '🟩', one_order: '🟨', two_orders: '🟧', farther: '⬛' };
export const scoreBand = (score: number) => scoreBandSymbol[scoreBandName(score)];

export function shareCardModel(dayKey: string, scores: number[]) {
  return {
    schema_version: 'ai-games.how-big-share/1.0.0',
    date: dayKey,
    bands: scores.map(scoreBandName),
    score_total: scores.reduce((sum, score) => sum + score, 0),
    score_max: scores.length * 1000,
    within_one_order: scores.filter((score) => score >= 500).length,
  };
}

export function shareReceipt(dayKey: string, scores: number[]) {
  const card = shareCardModel(dayKey, scores);
  return `HOW BIG? / Bio Numbers · ${card.date}\n${scores.map(scoreBand).join('')}\n${card.score_total}/${card.score_max} · no spoilers\nhttps://ai.rhyslindmark.com/games/how-big-bio`;
}

const superscriptDigits: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export function scientific(value: number) {
  const exponent = Math.floor(Math.log10(value));
  const coefficient = value / 10 ** exponent;
  return `${coefficient.toFixed(coefficient < 2 ? 1 : 0)} × 10${String(exponent).split('').map((char) => superscriptDigits[char]).join('')}`;
}
