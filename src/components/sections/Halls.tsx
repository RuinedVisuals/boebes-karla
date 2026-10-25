'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { useDragInertia } from '@/lib/useDragInertia';
import { useExperience } from '@/components/providers/Experience';
import Icon from '@/components/ui/Icon';
import type { Hall } from '@/lib/content';
import s from './Halls.module.scss';

/** «Αίθουσες»: 3D coverflow of the museum's rooms. Drag, throw, or use the arrows. */
export default function Halls({ halls }: { halls: Hall[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(1);
  const activeRef = useRef(1);
  const { go } = useExperience();

  const onFrame = useCallback((pos: number) => {
    const spread = Math.min(330, window.innerWidth * 0.26);
    cards.current.forEach((node, i) => {
      if (!node) return;
      const d = i - pos, ad = Math.abs(d);
      node.style.transform = `translate3d(${(d * spread).toFixed(1)}px, ${(ad * 34).toFixed(1)}px, ${(-ad * 180).toFixed(1)}px) rotateY(${(-d * 14).toFixed(2)}deg)`;
      node.style.zIndex = String(100 - Math.round(ad * 10));
      node.style.filter = `grayscale(${Math.min(1, ad).toFixed(2)}) brightness(${(1 - Math.min(0.45, ad * 0.25)).toFixed(2)})`;
    });
    const a = Math.max(0, Math.min(halls.length - 1, Math.round(pos)));
    if (a !== activeRef.current) { activeRef.current = a; setActive(a); }
  }, [halls.length]);

  const carousel = useDragInertia(stage, { count: halls.length, span: 320, onFrame, start: 1 });

  return (
    <section id="halls" className={s.halls} aria-roledescription="carousel" aria-labelledby="halls-title">
      <div className={s.head}>
        <h2 id="halls-title" className={s.h}>Αίθουσες</h2>
        <div className={s.controls}>
          <span className={s.count} aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(halls.length).padStart(2, '0')}</span>
          <button type="button" className={s.nav} onClick={() => carousel.goTo(carousel.index - 1)} aria-label="Προηγούμενη αίθουσα"><Icon name="prev" /></button>
          <button type="button" className={s.nav} onClick={() => carousel.goTo(carousel.index + 1)} aria-label="Επόμενη αίθουσα"><Icon name="next" /></button>
        </div>
      </div>
      <div ref={stage} className={s.stage} data-cursor="Σύρετε">
        {halls.map((h, i) => (
          <a
            key={h.title}
            ref={(el) => { cards.current[i] = el; }}
            href="#halls"
            className={s.card}
            draggable={false}
            aria-label={`${h.title}, ${h.kicker}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (carousel.moved > 8) return;
              if (carousel.index !== i) { carousel.goTo(i); return; }
              go(h.title, 'halls', `Νο ${String(i + 1).padStart(2, '0')}`);
            }}
          >
            <Image src={h.image.src} alt="" fill sizes="380px" draggable={false} />
            <div className={s.overlay}>
              <span className={s.label}>{String(i + 1).padStart(2, '0')} · {h.kicker}</span>
              <h3 className={s.title}>{h.title}</h3>
            </div>
          </a>
        ))}
      </div>
      <p key={active} className={s.desc}>{halls[active]?.text}</p>
    </section>
  );
}
