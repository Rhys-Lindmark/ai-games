'use client';

import { ArrowLeft, ExternalLink, RotateCcw, Sigma } from 'lucide-react';
import { useState } from 'react';
import { bioNumbersDeck as questions, magnitudeFactor, magnitudeScore, scientific } from '@/lib/how-big';

export default function HowBigBio() {
  const [index, setIndex] = useState(0);
  const [guessExponent, setGuessExponent] = useState(6);
  const [locked, setLocked] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const item = questions[index];
  const points = magnitudeScore(guessExponent, item.value);
  const factor = magnitudeFactor(guessExponent, item.value);
  const guess = 10 ** guessExponent;
  const complete = locked && scores.length === questions.length;
  const total = scores.reduce((sum, score) => sum + score, 0);

  const lock = () => { if (!locked) { setLocked(true); setScores((current) => [...current, points]); } };
  const next = () => { setIndex((current) => current + 1); setGuessExponent(6); setLocked(false); };
  const restart = () => { setIndex(0); setGuessExponent(6); setLocked(false); setScores([]); };

  return <main className="min-h-screen bg-paper text-ink">
    <header className="border-b-2 border-ink"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-10"><a className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase" href="/"><ArrowLeft className="h-4 w-4" /> AI Games</a><span className="font-mono text-[9px] font-bold uppercase text-cobalt">HOW BIG? / Bio Numbers</span></div></header>
    <section className="border-b-2 border-ink bg-cobalt text-paper"><div className="mx-auto max-w-6xl px-5 py-10 md:px-10"><div className="inline-flex border border-acid px-3 py-2 font-mono text-[9px] font-bold uppercase text-acid">Shape rotator 002 · sourced draft</div><h1 className="mt-5 text-6xl font-black leading-[.85] tracking-[-0.075em] md:text-8xl">HOW BIG<br /><span className="text-acid">IS LIFE?</span></h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/70">Place biological quantities on a logarithmic scale. One notch means ten times bigger—not one unit more.</p></div></section>
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-10 lg:grid-cols-[.62fr_1.38fr]">
      <aside><p className="font-mono text-[9px] font-bold uppercase text-coral">Twelve-question field test</p><h2 className="mt-3 text-4xl font-black tracking-[-.05em]">BUILD A FEEL FOR ORDERS OF MAGNITUDE.</h2><p className="mt-5 text-sm leading-relaxed text-ink/60">Half the points survive each order of magnitude you miss by. Every reveal names the counted thing, reference population, and source.</p><div className="mt-7 border-2 border-ink bg-white p-4 font-mono text-[9px] font-bold uppercase shadow-[4px_4px_0_#1c1c1a]"><p>Round {index + 1} / {questions.length}</p><p className="mt-2 text-cobalt">Score {total}</p><p className="mt-2 text-ink/45">Sources checked 2026-08-30</p></div></aside>
      <article className="border-2 border-ink bg-white p-6 shadow-[9px_9px_0_#d8ff39] md:p-9">
        <div className="flex items-center justify-between border-b border-ink/15 pb-5"><div><p className="font-mono text-[9px] font-bold uppercase text-cobalt">Choose the exponent</p><p className="mt-1 font-mono text-[8px] uppercase text-ink/40">10⁻¹⁰ to 10³¹</p></div><Sigma className="h-7 w-7 text-coral" /></div>
        <h2 className="mt-8 text-4xl font-black leading-[.96] tracking-[-.055em] md:text-6xl">{item.prompt}</h2>
        <div className="mt-12"><div className="mb-4 flex items-end justify-between gap-4"><span className="font-mono text-[9px] text-ink/40">10⁻¹⁰</span><div className="text-center"><p className="font-mono text-[8px] font-bold uppercase text-coral">Your estimate</p><strong className="mt-1 block text-3xl">10<sup>{guessExponent.toFixed(1)}</sup></strong><span className="font-mono text-[8px] text-ink/45">≈ {guess.toExponential(1)}</span></div><span className="font-mono text-[9px] text-ink/40">10³¹</span></div><input aria-label="Choose an exponent from negative ten to thirty-one" className="timeline-slider w-full" disabled={locked} max="31" min="-10" onChange={(event) => setGuessExponent(Number(event.target.value))} step="0.1" type="range" value={guessExponent} /><div className="mt-3 flex justify-between font-mono text-[7px] font-bold uppercase text-ink/35"><span>Molecular</span><span>Organism</span><span>Biosphere</span></div></div>
        {!locked ? <button className="mt-9 w-full bg-ink px-6 py-4 font-mono text-[10px] font-bold uppercase text-paper" onClick={lock}>Lock in 10^{guessExponent.toFixed(1)}</button> : <div className="mt-9 border-2 border-ink bg-paper p-5"><p className="font-mono text-[9px] font-bold uppercase text-coral">Reference answer</p><p className="mt-2 text-4xl font-black">{scientific(item.value)} {item.unit}</p><p className="mt-2 font-mono text-[9px] font-bold uppercase text-cobalt">{factor < 1.06 ? 'Bullseye' : `${factor.toFixed(factor < 10 ? 1 : 0)}× ${guess > item.value ? 'too high' : 'too low'}`} · {points} points</p><p className="mt-5 text-sm leading-relaxed text-ink/60">{item.note}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-4"><a className="inline-flex items-center gap-1 font-mono text-[8px] font-bold uppercase text-cobalt underline" href={item.sourceUrl} target="_blank" rel="noreferrer">{item.source} <ExternalLink className="h-3 w-3" /></a>{complete ? <button className="inline-flex items-center gap-2 border-2 border-ink bg-acid px-4 py-3 font-mono text-[9px] font-bold uppercase text-cobalt shadow-[3px_3px_0_#1c1c1a]" onClick={restart}>Play again · {total}/{questions.length * 1000} <RotateCcw className="h-4 w-4" /></button> : <button className="inline-flex items-center gap-2 font-mono text-[9px] font-bold uppercase text-cobalt" onClick={next}>Next quantity <RotateCcw className="h-4 w-4" /></button>}</div>{complete ? <p className="mt-5 border-t-2 border-ink pt-4 font-mono text-[9px] font-bold uppercase">Average {Math.round(total / questions.length)} points · {scores.filter((score) => score >= 500).length}/{questions.length} within one order of magnitude</p> : null}</div>}
      </article>
    </section>
  </main>;
}
