'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersStill } from '@/lib/gsap';
import s from './Cursor.module.scss';

/**
 * Dot + trailing ring. Over [data-cursor] it grows and shows the label ("Σύρετε", "Δείτε", "Play");
 * over links and buttons it grows a little. Only with a fine pointer and motion allowed.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersStill() || !window.matchMedia('(pointer: fine)').matches) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const dx = gsap.quickSetter(dot.current, 'x', 'px');
    const dy = gsap.quickSetter(dot.current, 'y', 'px');
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });
    let mode = '';
    let text = '';

    const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const lab = t.closest('[data-cursor]');
      const link = t.closest('a,button');
      let nm = '', nt = '';
      if (lab && (!link || link === lab || !lab.contains(link))) { nm = s.label; nt = lab.getAttribute('data-cursor') || ''; }
      else if (link) nm = s.link;
      if (nm !== mode || nt !== text) {
        mode = nm; text = nt;
        if (ring.current) ring.current.className = `${s.ring} ${mode}`;
        if (label.current) label.current.textContent = text;
      }
    };
    const down = () => ring.current?.classList.add(s.down);
    const up = () => ring.current?.classList.remove(s.down);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <div className={s.root} aria-hidden="true">
      <div ref={dot} className={s.dot} />
      <div ref={ring} className={s.ring}><span ref={label} /></div>
    </div>
  );
}
