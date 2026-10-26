'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import SectionHead from '@/components/ui/SectionHead';
import type { ManifestoSegment } from '@/lib/content';
import s from './Manifesto.module.scss';

// `to` is what the counter rolls up to; the server renders the final figure, so it reads right without JS.
const STATS = [
  { to: 2.5, dec: 1, suffix: ' εκ.', l: 'χρόνια ζωής της λίμνης' },
  { to: 180000, l: 'στρέμματα στη μεγαλύτερη έκτασή της' },
  { to: 1962, from: 1850, plain: true, l: 'η αποξήρανση', accent: true },
  { to: 143, l: 'είδη πουλιών καταγράφηκαν' },
];

const fmt = (v: number, dec = 0, plain = false) =>
  v.toLocaleString('el-GR', { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: !plain });

/**
 * Editorial split: a quiet heading column on the left, the statement on the right.
 * Words light up with the scroll; the small images open sideways inside the sentence.
 */
export default function Manifesto({ segments }: { segments: ManifestoSegment[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersStill()) return;
    const items = gsap.utils.toArray<HTMLElement>(`.${s.word}, .${s.pill}`, root.current);
    const tl = gsap.timeline({ scrollTrigger: { trigger: `.${s.text}`, start: 'top 78%', end: 'bottom 55%', scrub: 0.6 } });
    items.forEach((el, i) => {
      if (el.classList.contains(s.pill)) tl.to(el, { width: '1.9em', marginLeft: '0.12em', marginRight: '0.12em', duration: 2.2, ease: 'power2.out' }, i * 0.12);
      else tl.to(el, { opacity: 1, duration: 0.5, ease: 'none' }, i * 0.12);
    });

    // Figures roll up once, together, when the row comes into view.
    gsap.utils.toArray<HTMLElement>(`.${s.value}`, root.current).forEach((el, i) => {
      const st = STATS[i];
      const o = { v: st.from ?? 0 };
      const paint = () => { el.textContent = fmt(o.v, st.dec, st.plain); };
      paint();
      gsap.to(o, { v: st.to, duration: 2.2, delay: i * 0.12, ease: 'expo.out', onUpdate: paint, scrollTrigger: { trigger: `.${s.stats}`, start: 'top 85%', once: true } });
    });
  }, { scope: root });

  return (
    <section id="manifesto" ref={root} className={s.manifesto} aria-labelledby="manifesto-title">
      <div className={s.grid}>
        <div className={s.side}>
          <SectionHead index="00" kicker="Το μουσείο" title="Στο παλιό σινεμά των Καναλίων" id="manifesto-title" />
          <p className={s.note}>Θεματικό μουσείο του ΚΕ.ΜΕ.ΒΟ. από το 2005, για τον πολιτισμό της λίμνης πριν την αποξήρανση και τους ανθρώπους του κάμπου ως σήμερα.</p>
        </div>
        <p className={s.text}>
          {segments.map((seg, i) =>
            seg.kind === 'image' ? (
              <span key={i} className={s.pill}><img src={seg.image.src} alt="" /></span>
            ) : (
              seg.text.split(' ').map((w, j) => <span key={`${i}-${j}`} className={s.word}>{w} </span>)
            ),
          )}
        </p>
      </div>
      <dl className={s.stats}>
        {STATS.map((st) => (
          <div key={st.l} className={s.stat}>
            <dt className={s.label}>{st.l}</dt>
            <dd className={`${s.num} ${st.accent ? s.accent : ''}`}>
              <span className={s.value}>{fmt(st.to, st.dec, st.plain)}</span>{st.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
