'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const inventions = [
  { name: 'Spinning jenny', year: 1764, detail: 'James Hargreaves’ multi-spindle spinning frame. Draft fact awaiting source review.' },
  { name: 'Watt steam engine', year: 1769, detail: 'James Watt patented his separate-condenser improvement. Draft fact awaiting source review.' },
  { name: 'Telegraph', year: 1837, detail: 'Cooke–Wheatstone and Morse systems arrived in the same era. The date definition needs review.' },
];

export default function GamesLab() {
  const [question, setQuestion] = useState(0);
  const [guess, setGuess] = useState(1750);
  const [submitted, setSubmitted] = useState(false);
  const item = inventions[question];
  const distance = Math.abs(guess - item.year);
  const points = useMemo(() => Math.max(0, 1000 - distance * 12), [distance]);
  const nextQuestion = () => { setQuestion((current) => (current + 1) % inventions.length); setGuess(1750); setSubmitted(false); };

  return <main className="min-h-screen bg-paper text-ink">
    <header className="border-b border-ink/15"><div className="mx-auto flex max-w-xl items-center justify-between px-5 py-5"><Link className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink" href="/"><ArrowLeft className="h-4 w-4" /> AI / RL</Link><span className="font-mono text-[9px] uppercase tracking-[.16em] text-ink/45">Games · draft</span></div></header>
    <section className="mx-auto max-w-xl px-5 py-12 md:py-16">
      <div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/45">Daily game</p><h1 className="mt-2 text-6xl font-semibold tracking-[-.06em]">When?</h1></div><Link className="border-b border-ink text-sm" href="/how-big-bio">Play Bio Numbers</Link></div>
      <p className="mt-4 text-lg text-ink/60">Put an invention on the timeline.</p>
      <article className="mt-14 border-t border-ink pt-7"><div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-ink/45"><span>{question + 1} / {inventions.length}</span><span>Draft dates</span></div><h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-.035em] md:text-4xl">When was the {item.name.toLowerCase()} introduced?</h2><div className="mt-12"><div className="mb-5 flex items-end justify-between"><span className="font-mono text-[9px] text-ink/40">1600</span><strong className="text-4xl font-medium tracking-[-.04em]">{guess}</strong><span className="font-mono text-[9px] text-ink/40">2000</span></div><input aria-label="Choose a year from 1600 to 2000" className="timeline-slider w-full" disabled={submitted} max="2000" min="1600" onChange={(event) => setGuess(Number(event.target.value))} type="range" value={guess} /></div>{!submitted ? <button className="mt-10 w-full bg-ink px-6 py-4 text-sm font-medium text-paper" onClick={() => setSubmitted(true)}>Check {guess}</button> : <div aria-live="polite" className="mt-10 border-t border-ink/20 pt-7"><div className="flex items-baseline justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45">Answer · {item.year}</p><p className="mt-2 text-3xl font-medium tracking-[-.04em]">{distance} years away</p></div><span className="font-mono text-sm">{points} pts</span></div><p className="mt-5 text-sm leading-relaxed text-ink/55">{item.detail}</p><button className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={nextQuestion}>Next <RotateCcw className="h-4 w-4" /></button></div>}</article>
      <footer className="mt-16 border-t border-ink/15 pt-6 text-xs leading-relaxed text-ink/45">Dates remain visibly draft until source review is complete.</footer>
    </section>
  </main>;
}
