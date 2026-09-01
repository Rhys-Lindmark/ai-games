'use client';

import { ExternalLink, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { dailyHistoryDeck, formatHistoryYear, type HistoryEra, historyLevel, historyPoints, historyQuestions, historyQuestionTarget, parseHistoryGuess } from '@/lib/history';

const localDayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export default function GamesLab() {
  const [dayKey] = useState(localDayKey);
  const questions = useMemo(() => dailyHistoryDeck(dayKey), [dayKey]);
  const [index, setIndex] = useState(0);
  const [guessText, setGuessText] = useState('');
  const [era, setEra] = useState<HistoryEra>('CE');
  const [submittedGuess, setSubmittedGuess] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const item = questions[index];
  const parsedGuess = parseHistoryGuess(guessText, era);
  const distance = submittedGuess === null ? 0 : Math.abs(submittedGuess - item.year);
  const points = submittedGuess === null ? 0 : historyPoints(submittedGuess, item.year);
  const complete = submittedGuess !== null && scores.length === questions.length;
  const total = scores.reduce((sum, score) => sum + score, 0);
  const level = historyLevel(scores);
  const timelineMin = submittedGuess === null ? item.min : Math.min(item.min, submittedGuess);
  const timelineMax = submittedGuess === null ? item.max : Math.max(item.max, submittedGuess);
  const timelinePosition = (year: number) => `${((year - timelineMin) / Math.max(1, timelineMax - timelineMin)) * 100}%`;

  const submit = () => {
    if (parsedGuess === null || submittedGuess !== null) return;
    setSubmittedGuess(parsedGuess);
    setScores((current) => [...current, historyPoints(parsedGuess, item.year)]);
  };
  const nextQuestion = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setGuessText('');
    setEra('CE');
    setSubmittedGuess(null);
  };
  const restart = () => { setIndex(0); setGuessText(''); setEra('CE'); setSubmittedGuess(null); setScores([]); };

  return <main className="min-h-screen bg-paper text-ink">
    <header className="border-b border-ink/15"><div className="mx-auto flex max-w-xl items-center justify-between px-5 py-5"><Link className="text-sm font-semibold" href="/">When?</Link><Link aria-label="Open Bio Numbers" className="border-b border-ink text-sm" href="/how-big-bio">Bio Numbers</Link></div></header>
    <section className="mx-auto max-w-xl px-5 py-12 md:py-16">
      <div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/45">Daily ten · {dayKey}</p><h1 className="mt-2 text-6xl font-semibold tracking-[-.06em]">When?</h1></div><span className="font-mono text-xs text-ink/45">{index + 1} / {questions.length}</span></div>
      <p className="mt-4 text-lg text-ink/60">Put ten important events on the timeline.</p>

      <article className="mt-14 border-t border-ink pt-7">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-ink/45"><span>{item.difficulty}</span><span>{scores.length} answered</span></div>
        <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-.035em] md:text-4xl">{item.prompt}</h2>
        {submittedGuess === null ? <form className="mt-12" onSubmit={(event) => { event.preventDefault(); submit(); }}>
          <label className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45" htmlFor="history-year">Your year</label>
          <div className="mt-3 flex border-b border-ink">
            <input autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3 text-4xl font-medium tracking-[-.04em] outline-none placeholder:text-ink/20" id="history-year" inputMode="numeric" min="1" onChange={(event) => setGuessText(event.target.value)} placeholder="Year" step="1" type="number" value={guessText} />
            <fieldset className="m-0 flex items-center gap-1 border-0 p-0 pb-2" aria-label="Era">
              {(['BCE', 'CE'] as const).map((option) => <button aria-pressed={era === option} className={`px-3 py-2 font-mono text-xs ${era === option ? 'bg-ink text-paper' : 'text-ink/45'}`} key={option} onClick={() => setEra(option)} type="button">{option}</button>)}
            </fieldset>
          </div>
          <button className="mt-8 w-full bg-ink px-6 py-4 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-25" disabled={parsedGuess === null} type="submit">Check</button>
        </form> : <div aria-live="polite" className="mt-10 border-t border-ink/20 pt-7">
          <div className="flex items-baseline justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45">Answer · {formatHistoryYear(item.year)}</p><p className="mt-2 text-3xl font-medium tracking-[-.04em]">{distance === 0 ? 'Exact' : `${distance} years away`}</p></div><span className="font-mono text-sm">{points} pts</span></div>
          <div className="mt-8" aria-label={`Your guess was ${formatHistoryYear(submittedGuess)}. The answer was ${formatHistoryYear(item.year)}.`}>
            <div className="relative h-12 border-y border-ink/15">
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ink" style={{ left: timelinePosition(submittedGuess) }} />
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-paper" style={{ left: timelinePosition(item.year) }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px] text-ink/45"><span>You · {formatHistoryYear(submittedGuess)}</span><span>Answer · {formatHistoryYear(item.year)}</span></div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink/55">{item.detail}</p>
          <div className="mt-7 flex items-center justify-between gap-5"><a className="inline-flex items-center gap-1 border-b border-ink pb-1 text-xs" href={item.sourceUrl} rel="noreferrer" target="_blank">Source <ExternalLink className="h-3 w-3" /></a>{complete ? <button className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={restart}>Play again <RotateCcw className="h-4 w-4" /></button> : <button className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={nextQuestion}>Next <RotateCcw className="h-4 w-4" /></button>}</div>
          {complete ? <section className="mt-9 border-y border-ink py-8"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45">Your history level</p><h3 className="mt-2 text-4xl font-semibold tracking-[-.045em]">{level.name}</h3><p className="mt-3 text-sm text-ink/60">{level.note} · {total}/{questions.length * 1000} points</p><p className="mt-4 text-xs leading-relaxed text-ink/40">A playful comparison, not a real academic assessment.</p></section> : null}
        </div>}
      </article>
      <footer className="mt-16 border-t border-ink/15 pt-6 text-xs leading-relaxed text-ink/45">{historyQuestions.length} verified questions in the library · target {historyQuestionTarget.toLocaleString()} · ten new questions per release batch.</footer>
    </section>
  </main>;
}
