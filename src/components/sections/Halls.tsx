'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useDragInertia } from '@/lib/useDragInertia';
import { useExperience } from '@/components/providers/Experience';
import SectionHead from '@/components/ui/SectionHead';
import Icon from '@/components/ui/Icon';
import type { Hall } from '@/lib/content';
import s from './Halls.module.scss';

// One quiet, dark tone per room (each passes 4.5:1 with the cream text).
const TONES = ['#1d3436', '#2b2d1a', '#3a2119', '#1f2a24', '#2a2320', '#1a2426'];

/** «Αίθουσες»: readable info column + 3D coverflow; the whole section takes on the tone of the active room. */
export default function Halls({ halls }: { halls: Hall[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(1);
  const activeRef = useRef(1);
  const { go } = useExperience();

  const onFrame = useCallback((pos: number) => {
    const spread = Math.min(260, window.innerWidth * 0.2);
    cards.current.forEach((node, i) => {
      if (!node) return;
      const d = i - pos, ad = Math.abs(d);
      node.style.transform = `translate3d(${(d * spread).toFixed(1)}px, 0, ${(-ad * 160).toFixed(1)}px) rotateY(${(-d * 18).toFixed(2)}deg)`;
      node.style.zIndex = String(100 - Math.round(ad * 10));
      node.style.opacity = String(Math.max(0, 1 - Math.max(0, ad - 1.6) * 0.8).toFixed(2));
      node.style.filter = `grayscale(${Math.min(1, ad * 0.9).toFixed(2)}) brightness(${(1 - Math.min(0.5, ad * 0.28)).toFixed(2)})`;
    });
    const a = Math.max(0, Math.min(halls.length - 1, Math.round(pos)));
    if (a !== activeRef.current) { activeRef.current = a; setActive(a); }
  }, [halls.length]);

  const carousel = useDragInertia(stage, { count: halls.length, span: 260, onFrame, start: 1 });
  const h = halls[active];

  return (
    <section id="halls" className={s.halls} style={{ backgroundColor: TONES[active % TONES.length] }} aria-roledescription="carousel" aria-labelledby="halls-title">
      <div className={s.grid}>
        <div className={s.info}>
          <SectionHead index="03" kicker="Οι αίθουσες" title="Έξι ενότητες, μία λίμνη" id="halls-title" tone="light" />
          <div key={active} className={s.detail} aria-live="polite">
            <span className={s.num}>{String(active + 1).padStart(2, '0')} / {String(halls.length).padStart(2, '0')} · {h?.kicker}</span>
            <h3 className={s.title}>{h?.title}</h3>
            <p className={s.text}>{h?.text}</p>
          </div>
          <div className={s.controls}>
            <button type="button" className={s.nav} onClick={() => carousel.goTo(carousel.index - 1)} aria-label="Προηγούμενη αίθουσα"><Icon name="prev" /></button>
            <button type="button" className={s.nav} onClick={() => carousel.goTo(carousel.index + 1)} aria-label="Επόμενη αίθουσα"><Icon name="next" /></button>
          </div>
        </div>
        <div ref={stage} className={s.stage} data-cursor="Σύρετε">
          {halls.map((hall, i) => (
            <a
              key={hall.title}
              ref={(el) => { cards.current[i] = el; }}
              href="#halls"
              className={s.card}
              draggable={false}
              aria-label={`${hall.title}, ${hall.kicker}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (carousel.moved > 8) return;
                if (carousel.index !== i) { carousel.goTo(i); return; }
                go(hall.title, 'halls', `Αίθουσα ${String(i + 1).padStart(2, '0')}`);
              }}
            >
              <Image src={hall.image.src} alt="" fill sizes="340px" draggable={false} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
