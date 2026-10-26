'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import SectionHead from '@/components/ui/SectionHead';
import type { ManifestoSegment } from '@/lib/content';
import s from './Manifesto.module.scss';

const STATS = [
  { n: '2,5 εκ.', l: 'χρόνια ζωής της λίμνης' },
  { n: '180.000', l: 'στρέμματα στη μεγαλύτερη έκτασή της' },
  { n: '1962', l: 'η αποξήρανση', accent: true },
  { n: '143', l: 'είδη πουλιών καταγράφηκαν' },
];

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
          <div key={st.l}>
            <dt className={s.label}>{st.l}</dt>
            <dd className={`${s.num} ${st.accent ? s.accent : ''}`}>{st.n}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
