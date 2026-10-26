'use client';

import { useEffect, useRef, useState } from 'react';
import { HallScene } from '@/webgl/hall';
import { prefersStill } from '@/lib/gsap';
import type { Exhibit } from '@/lib/content';
import SectionHead from '@/components/ui/SectionHead';
import s from './Hall.module.scss';

/** «Η αίθουσα»: concave WebGL gallery of the exhibits. Falls back to a scrollable strip without WebGL. */
export default function Hall({ exhibits }: { exhibits: Exhibit[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const [glOk, setGlOk] = useState(true);

  useEffect(() => {
    if (!canvas.current) return;
    const scene = HallScene.create(canvas.current, exhibits.map((e) => e.image.src), setIndex, prefersStill);
    if (!scene) { setGlOk(false); return; }
    // Page scroll speed nudges the hall, so it feels connected to the rest of the page.
    let last = window.scrollY;
    const onScroll = () => { const y = window.scrollY; scene.scrollVel = Math.max(-0.02, Math.min(0.02, (y - last) * 0.00025)); last = y; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); scene.destroy(); };
  }, [exhibits]);

  const current = exhibits[index];

  return (
    <section id="hall" className={s.hall} aria-labelledby="hall-title">
      <div className={s.head}>
        <SectionHead index="02" kicker="Τα εκθέματα" title="Περιηγηθείτε στα εκθέματα" id="hall-title" tone="light" />
        <span className={s.now} aria-live="polite">{String(index + 1).padStart(2, '0')} — {current?.title}</span>
      </div>
      {glOk ? (
        <canvas ref={canvas} className={s.canvas} data-cursor="Σύρετε" aria-label="Περιστρεφόμενη αίθουσα με εκθέματα. Σύρετε για να περιηγηθείτε." role="img" />
      ) : (
        <ul className={s.strip}>
          {exhibits.map((e, i) => (
            <li key={i}><img src={e.image.src} alt={e.image.alt} loading="lazy" /><span>{String(i + 1).padStart(2, '0')} — {e.title}</span></li>
          ))}
        </ul>
      )}
      <p className={s.hint}>Σύρετε για να περιηγηθείτε στα εκθέματα</p>
    </section>
  );
}
