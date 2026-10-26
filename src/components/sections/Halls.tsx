'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import SectionHead from '@/components/ui/SectionHead';
import type { Hall } from '@/lib/content';
import s from './Halls.module.scss';

/**
 * «Αίθουσες»: a museum floor index. Six numbered rooms on the left; pointing at, focusing or
 * tapping one wipes its photograph into the large frame on the right, like turning a catalogue page.
 */
export default function Halls({ halls }: { halls: Hall[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActiveRaw] = useState(0);
  const [prev, setPrev] = useState(0);
  // The outgoing photo stays underneath until the new one has wiped over it.
  const setActive = (i: number) => { if (i === active) return; setPrev(active); setActiveRaw(i); };
  const h = halls[active];

  useGSAP(() => {
    if (prefersStill()) return;
    gsap.from(`.${s.row}`, { yPercent: 60, opacity: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: `.${s.index}`, start: 'top 80%', once: true } });
    gsap.from(`.${s.frame}`, { clipPath: 'inset(12% 8% 12% 8% round 20px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: `.${s.frame}`, start: 'top 85%', once: true } });
  }, { scope: root });

  return (
    <section id="halls" ref={root} className={s.halls} aria-labelledby="halls-title">
      <div className={s.grid}>
        <div className={s.side}>
          <SectionHead index="02" kicker="Οι αίθουσες" title="Έξι ενότητες, μία λίμνη" id="halls-title" />
          <ol className={s.index}>
            {halls.map((hall, i) => (
              <li key={hall.title}>
                <button
                  type="button"
                  className={s.row}
                  aria-pressed={i === active}
                  aria-controls="halls-frame"
                  onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(i); }}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.title}>{hall.title}</span>
                  <span className={s.kicker}>{hall.kicker}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <figure id="halls-frame" className={s.frame}>
          {halls.map((hall, i) => (
            <div key={hall.title} className={`${s.shot} ${i === active ? s.on : i === prev ? s.past : ''}`} aria-hidden={i !== active}>
              <Image src={hall.image.src} alt={hall.image.alt} fill sizes="(max-width: 980px) 100vw, 55vw" />
            </div>
          ))}
          <span className={s.big} aria-hidden="true">{String(active + 1).padStart(2, '0')}</span>
          <figcaption key={active} className={s.caption} aria-live="polite">
            <span className={s.label}>{h?.kicker} · Αίθουσα {String(active + 1).padStart(2, '0')} / {String(halls.length).padStart(2, '0')}</span>
            <p className={s.text}>{h?.text}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
