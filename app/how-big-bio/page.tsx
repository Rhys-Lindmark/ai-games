'use client';

import { ArrowLeft, ExternalLink, RotateCcw, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { bioNumbersDeck, dailyBioDeck, dailyDayKey, magnitudeFactor, magnitudeScore, scientific, shareCardModel, shareReceipt, type ScoreBandName } from '@/lib/how-big';

const bandClass: Record<ScoreBandName, string> = { half_order: 'bg-ink', one_order: 'bg-ink/70', two_orders: 'bg-ink/35', farther: 'bg-transparent' };
const bandLabel: Record<ScoreBandName, string> = { half_order: 'within half an order', one_order: 'within one order', two_orders: 'within two orders', farther: 'more than two orders away' };

export default function HowBigBio() {
  const [index, setIndex] = useState(0);
  const [guessExponent, setGuessExponent] = useState(6);
  const [locked, setLocked] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [dayKey] = useState(() => dailyDayKey());
  const [shareState, setShareState] = useState('Copy non-spoiling result');
  const sliderRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const questions = useMemo(() => dailyBioDeck(bioNumbersDeck, dayKey), [dayKey]);
  const item = questions[index];
  const points = magnitudeScore(guessExponent, item.value);
  const factor = magnitudeFactor(guessExponent, item.value);
  const guess = 10 ** guessExponent;
  const complete = locked && scores.length === questions.length;
  const total = scores.reduce((sum, score) => sum + score, 0);
  const shareCard = shareCardModel(dayKey, scores);

  useEffect(() => {
    if (locked) actionRef.current?.focus();
    else if (index > 0) sliderRef.current?.focus();
  }, [index, locked]);

  const lock = () => { if (!locked) { setLocked(true); setScores((current) => [...current, points]); } };
  const next = () => { setIndex((current) => current + 1); setGuessExponent(6); setLocked(false); };
  const restart = () => { setIndex(0); setGuessExponent(6); setLocked(false); setScores([]); };
  const copyShare = async () => { try { await navigator.clipboard.writeText(shareReceipt(dayKey, scores)); setShareState('Copied — no answers included'); } catch { setShareState('Copy unavailable in this browser'); } };

  return <main className="min-h-screen bg-paper text-ink">
    <header className="border-b border-ink/15"><div className="mx-auto flex max-w-xl items-center justify-between px-5 py-5"><Link className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink" href="/"><ArrowLeft className="h-4 w-4" /> Games</Link><span className="font-mono text-[9px] uppercase tracking-[.16em] text-ink/45">Bio Numbers · draft</span></div></header>
    <section className="mx-auto max-w-xl px-5 py-12 md:py-16">
      <div className="flex items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ink/45">Daily five</p><h1 className="mt-2 text-5xl font-semibold tracking-[-.055em] md:text-6xl">How big?</h1></div><span className="font-mono text-xs text-ink/45">{index + 1} / {questions.length}</span></div>
      <p className="mt-4 text-lg text-ink/60">Guess the nearest power of ten.</p>
      <article className="mt-14 border-t border-ink pt-7">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[.14em] text-ink/45"><span>{dayKey}</span><span>{total} pts</span></div>
        <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-.035em] md:text-4xl">{item.prompt}</h2>
        <div className="mt-12"><div className="mb-5 flex items-end justify-between gap-4"><span className="font-mono text-[9px] text-ink/40">1e-10</span><div className="text-center"><p className="font-mono text-[8px] uppercase tracking-[.14em] text-ink/45">Your guess</p><strong className="mt-1 block text-4xl font-medium tracking-[-.04em]">1e{guessExponent.toFixed(1)}</strong></div><span className="font-mono text-[9px] text-ink/40">1e31</span></div><input aria-label="Choose an exponent from negative ten to thirty-one" className="timeline-slider w-full" disabled={locked} max="31" min="-10" onChange={(event) => setGuessExponent(Number(event.target.value))} ref={sliderRef} step="0.1" type="range" value={guessExponent} /></div>
        {!locked ? <button className="mt-10 w-full bg-ink px-6 py-4 text-sm font-medium text-paper" onClick={lock}>Check 1e{guessExponent.toFixed(1)}</button> : <div aria-live="polite" className="mt-10 border-t border-ink/20 pt-7"><p className="font-mono text-[9px] uppercase tracking-[.14em] text-ink/45">Answer</p><p className="mt-2 text-3xl font-medium tracking-[-.04em]">{scientific(item.value)} {item.unit}</p><p className="mt-2 text-sm text-ink/60">{factor < 1.06 ? 'Bullseye' : `${factor.toFixed(factor < 10 ? 1 : 0)}× ${guess > item.value ? 'too high' : 'too low'}`} · {points} points</p><p className="mt-5 text-sm leading-relaxed text-ink/60">{item.note}</p><div className="mt-7 flex flex-wrap items-center justify-between gap-5"><a className="inline-flex items-center gap-1 border-b border-ink pb-1 text-xs" href={item.sourceUrl} target="_blank" rel="noreferrer">Source <ExternalLink className="h-3 w-3" /></a>{complete ? <button className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={restart} ref={actionRef}>Play again · {total}/{questions.length * 1000} <RotateCcw className="h-4 w-4" /></button> : <button className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={next} ref={actionRef}>Next <RotateCcw className="h-4 w-4" /></button>}</div>{complete ? <div className="mt-8 border-t border-ink/15 pt-7"><div aria-label={`Non-spoiling result: ${shareCard.bands.map((band) => bandLabel[band]).join(', ')}`} className="max-w-md border border-ink/25 bg-white p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[8px] uppercase tracking-[.14em]">Bio Numbers</p><p className="mt-1 font-mono text-[8px] text-ink/45">{shareCard.date} · no spoilers</p></div><strong className="text-xl font-medium">{shareCard.score_total}/{shareCard.score_max}</strong></div><div className="mt-5 grid grid-cols-5 gap-2" aria-hidden="true">{shareCard.bands.map((band, bandIndex) => <span className={`aspect-square border border-ink ${bandClass[band]}`} key={`${band}-${bandIndex}`} />)}</div><p className="mt-4 font-mono text-[8px] text-ink/55">{shareCard.within_one_order}/{shareCard.bands.length} within one order</p></div><button className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm" onClick={copyShare}><Share2 className="h-4 w-4" /> {shareState}</button><span aria-live="polite" className="sr-only">{shareState}</span></div> : null}</div>}
      </article>
    </section>
  </main>;
}
