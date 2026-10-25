'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersStill } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { eventCategoryLabel, type EventCategory, type EventItem } from '@/lib/content';
import s from './Events.module.scss';

const TABS: ('all' | EventCategory)[] = ['all', 'culture', 'environment', 'education'];

/** Numbered event list with category filter; an image of the hovered event follows the cursor. */
export default function Events({ events }: { events: EventItem[] }) {
  const [tab, setTab] = useState<'all' | EventCategory>('all');
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const previewImg = useRef<HTMLImageElement>(null);
  const list = events.filter((e) => tab === 'all' || e.category === tab);

  useEffect(() => {
    const sec = root.current, pv = preview.current;
    if (!sec || !pv || prefersStill() || !window.matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(pv, 'x', { duration: 0.55, ease: 'power3.out' });
    const y = gsap.quickTo(pv, 'y', { duration: 0.55, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      x(e.clientX + 28); y(e.clientY - 100);
      const row = (e.target as Element).closest?.(`.${s.row}`) as HTMLElement | null;
      pv.classList.toggle(s.on, !!row);
      const src = row?.dataset.img;
      if (src && previewImg.current && previewImg.current.getAttribute('src') !== src) previewImg.current.src = src;
    };
    const leave = () => pv.classList.remove(s.on);
    sec.addEventListener('pointermove', move);
    sec.addEventListener('pointerleave', leave);
    return () => { sec.removeEventListener('pointermove', move); sec.removeEventListener('pointerleave', leave); };
  }, []);

  return (
    <section id="events" ref={root} className={s.events} aria-labelledby="events-title">
      <div className={s.head}>
        <h2 id="events-title" className={s.h}>Δράσεις</h2>
        <div className={s.tabs} role="group" aria-label="Κατηγορία δράσεων">
          {TABS.map((t) => (
            <button key={t} type="button" className={s.tab} aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t === 'all' ? 'Όλες' : eventCategoryLabel[t]}
            </button>
          ))}
        </div>
      </div>
      <ol className={s.list}>
        {list.map((e, i) => (
          <li key={e.title}>
            <a href={e.href} className={s.row} data-img={e.image.src} data-cursor="Δείτε">
              <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.title}>{e.title}</h3>
              <span className={s.meta}>{eventCategoryLabel[e.category]}</span>
              <time className={s.meta}>{e.date}</time>
              <span className={s.arrow}><Icon name="arrow-up-right" size={22} /></span>
            </a>
          </li>
        ))}
      </ol>
      <div className={s.more}><Button to="events" toTitle="Δράσεις" arrow>Όλες οι δράσεις</Button></div>
      <div ref={preview} className={s.preview} aria-hidden="true"><img ref={previewImg} src={events[0]?.image.src} alt="" /></div>
    </section>
  );
}
