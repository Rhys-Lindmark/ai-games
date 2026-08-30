'use client';

import { ArrowLeft, RotateCcw, Target } from 'lucide-react';
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

  function nextQuestion() {
    setQuestion((current) => (current + 1) % inventions.length);
    setGuess(1750);
    setSubmitted(false);
  }

  return <main className="min-h-screen bg-paper text-ink"><header className="border-b-2 border-ink"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10"><a className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase" href="/"><ArrowLeft className="h-4 w-4" /> AI / RL</a><span className="font-mono text-[9px] font-bold uppercase text-cobalt">Website Accelerator / games</span></div></header><section className="border-b-2 border-ink bg-ink text-paper"><div className="mx-auto max-w-6xl px-5 py-12 md:px-10"><div className="inline-flex border border-acid px-3 py-2 font-mono text-[9px] font-bold uppercase text-acid">Rough draft · source review in progress</div><h1 className="mt-5 text-6xl font-black leading-[.85] tracking-[-0.075em] md:text-9xl">FEEL THE<br /><span className="text-acid">NUMBER.</span></h1><p className="mt-6 max-w-2xl leading-relaxed text-paper/60">Word-game clarity for people who think in timelines, scales, systems, quantities, and causal structure.</p></div></section><section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono text-[10px] font-bold uppercase text-coral">Shape rotator 001</p><h2 className="mt-2 text-5xl font-black tracking-[-0.06em]">WHEN?</h2><p className="mt-4 text-sm leading-relaxed text-ink/55">Place an invention on the timeline. Close guesses earn more; every answer exposes the date definition and its review state.</p><div className="mt-8 grid gap-2">{['HOW BIG? / quantities', 'BEFORE / AFTER / sequences', 'SCALE SHIFT / translations'].map((label) => <div className="border border-ink/20 bg-white p-3 font-mono text-[9px] font-bold uppercase text-ink/40" key={label}>{label} · queued</div>)}</div></div><article className="border-2 border-ink bg-white p-6 shadow-[9px_9px_0_#214de8] md:p-9"><div className="flex items-center justify-between border-b border-ink/15 pb-5"><div><p className="font-mono text-[9px] font-bold uppercase text-cobalt">Daily draft</p><p className="mt-1 font-mono text-[9px] text-ink/40">Question {question + 1} of {inventions.length}</p></div><Target className="h-7 w-7 text-coral" /></div><h2 className="mt-8 text-4xl font-black leading-[.95] tracking-[-0.055em] md:text-6xl">When was the {item.name.toLowerCase()} introduced?</h2><div className="mt-12"><div className="mb-3 flex items-end justify-between"><span className="font-mono text-[9px] text-ink/40">1600</span><strong className="text-4xl">{guess}</strong><span className="font-mono text-[9px] text-ink/40">2000</span></div><input aria-label="Choose a year from 1600 to 2000" className="timeline-slider w-full" disabled={submitted} max="2000" min="1600" onChange={(event) => setGuess(Number(event.target.value))} type="range" value={guess} /></div>{!submitted ? <button className="mt-9 w-full bg-ink px-6 py-4 font-mono text-[10px] font-bold uppercase text-paper" onClick={() => setSubmitted(true)}>Lock in {guess}</button> : <div className="mt-9 border-2 border-ink bg-paper p-5"><div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[9px] font-bold uppercase text-coral">Draft answer · {item.year}</p><p className="mt-2 text-3xl font-black">{distance} years away</p></div><span className="rounded-full bg-acid px-4 py-3 text-center font-black">{points}</span></div><p className="mt-4 text-sm leading-relaxed text-ink/55">{item.detail}</p><button className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase text-cobalt" onClick={nextQuestion}>Next question <RotateCcw className="h-4 w-4" /></button></div>}</article></section></main>;
}
