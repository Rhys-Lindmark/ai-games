'use client';

import { ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { dailyHistoryDeck, formatHistoryYear, historyLevel, historyPoints, historyQuestions, historyQuestionTarget } from '@/lib/history';

const localDayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export default function GamesLab() {
  const [dayKey] = useState(localDayKey);
  const questions = useMemo(() => dailyHistoryDeck(dayKey), [dayKey]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(() => Math.round((questions[0].min + questions[0].max) / 2));
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const item = questions[index];
  const distance = Math.abs(guess - item.year);
  const points = historyPoints(guess, item.year);
  const complete = submitted && scores.length === questions.length;
  const total = scores.reduce((sum, score) => sum + score, 0);
  const level = historyLevel(scores);

  const submit = () => { setSubmitted(true); setScores((current) => [...current, points]); };
  const nextQuestion = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setGuess(Math.round((questions[nextIndex].min + questions[nextIndex].max) / 2));
    setSubmitted(false);
  };
  const restart = () => { setIndex(0); setGuess(Math.round((questions[0].min + questions[0].max) / 2)); setSubmitted(false); setScores([]); };

  return <main className="min-h-screen bg-paper text-ink">
    <header className="border-b border-ink/15"><div className="mx-auto flex max-w-xl items-center justify-between px-5 py-5"><Link className="text-sm font-semibold" href="/">When?</Link><Link className="border-b border-ink text-sm" href="/how-big-bio">Bio Numbers</Link></div></header>
    <section className="mx-auto max-w-xl px-5 py-12 md:py-16">
      <div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/45">Daily ten · {dayKey}</p><h1 className="mt-2 text-6xl font-semibold tracking-[-.06em]">When?</h1></div><span className="font-mono text-xs text-ink/45">{index + 1} / {questions.length}</span></div>
      <p className="mt-4 text-lg text-ink/60">Put ten important events on the timeline.</p>

      <article className="mt-14 border-t border-ink pt-7">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-ink/45"><span>{item.difficulty}</span><span>{scores.length} answered</span></div>
        <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-.035em] md:text-4xl">{item.prompt}</h2>
        <div className="mt-12"><div className="mb-5 flex items-end justify-between"><span className="font-mono text-[9px] text-ink/40">{formatHistoryYear(item.min)}</span><strong className="text-4xl font-medium tracking-[-.04em]">{formatHistoryYear(guess)}</strong><span className="font-mono text-[9px] text-ink/40">{formatHistoryYear(item.max)}</span></div><input aria-label={`Choose a year from ${formatHistoryYear(item.min)} to ${formatHistoryYear(item.max)}`} className="timeline-slider w-full" disabled={submitted} max={item.max} min={item.min} onChange={(event) => setGuess(Number(event.target.value))} type="range" value={guess} /></div>
        {!submitted ? <button className="mt-10 w-full bg-ink px-6 py-4 text-sm font-medium text-paper" onClick={submit}>Check {formatHistoryYear(guess)}</button> : <div aria-live="polite" className="mt-10 border-t border-ink/20 pt-7">
          <div className="flex items-baseline justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45">Answer · {formatHistoryYear(item.year)}</p><p className="mt-2 text-3xl font-medium tracking-[-.04em]">{distance === 0 ? 'Exact' : `${distance} years away`}</p></div><span className="font-mono text-sm">{points} pts</span></div>
          <p className="mt-5 text-sm leading-relaxed text-ink/55">{item.detail}</p>
          <div className="mt-7 flex items-center justify-between gap-5"><a className="inline-flex items-center gap-1 border-b border-ink pb-1 text-xs" href={item.sourceUrl} rel="noreferrer" target="_blank">Source <ExternalLink className="h-3 w-3" /></a>{complete ? <button className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={restart}>Play again <RotateCcw className="h-4 w-4" /></button> : <button className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={nextQuestion}>Next <RotateCcw className="h-4 w-4" /></button>}</div>
          {complete ? <section className="mt-9 border-y border-ink py-8"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45">Your history level</p><h3 className="mt-2 text-4xl font-semibold tracking-[-.045em]">{level.name}</h3><p className="mt-3 text-sm text-ink/60">{level.note} · {total}/{questions.length * 1000} points</p><p className="mt-4 text-xs leading-relaxed text-ink/40">A playful comparison, not a real academic assessment.</p></section> : null}
        </div>}
      </article>
      <footer className="mt-16 border-t border-ink/15 pt-6 text-xs leading-relaxed text-ink/45">{historyQuestions.length} verified questions in the library · target {historyQuestionTarget.toLocaleString()} · ten new questions per release batch.</footer>
    </section>
  </main>;
}
