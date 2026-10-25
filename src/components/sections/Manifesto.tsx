'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import type { ManifestoSegment } from '@/lib/content';
import s from './Manifesto.module.scss';

const STATS = [
  { n: '143', l: 'είδη πουλιών' },
  { n: '9', l: 'μήνες στα λούρα' },
  { n: '1962', l: 'η αποξήρανση', accent: true },
  { n: '2005', l: 'άνοιξε το μουσείο' },
];

/** A sentence that lights up word by word with the scroll, with small images set inside the text. */
export default function Manifesto({ segments }: { segments: ManifestoSegment[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersStill()) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 70%', scrub: 0.6 } });
    tl.to(`.${s.word}, .${s.pill}`, {
      opacity: 1,
      scale: 1,
      stagger: 0.12,
      ease: 'none',
    });
  }, { scope: root });

  return (
    <section id="manifesto" ref={root} className={s.manifesto} aria-labelledby="manifesto-title">
      <span id="manifesto-title" className={s.kicker}>Το μουσείο · Νο 00</span>
      <p className={s.text}>
        {segments.map((seg, i) =>
          seg.kind === 'image' ? (
            <span key={i} className={s.pill}><img src={seg.image.src} alt="" /></span>
          ) : (
            seg.text.split(' ').map((w, j) => <span key={`${i}-${j}`} className={s.word}>{w} </span>)
          ),
        )}
      </p>
      <dl className={s.stats}>
        {STATS.map((st) => (
          <div key={st.l}>
            <dt className={s.label}>{st.l}</dt>
            <dd className={`${s.num} ${st.accent ? s.accent : ''}`}>{st.n}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
