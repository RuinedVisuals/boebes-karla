'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import Icon from '@/components/ui/Icon';
import VideoModal from '@/components/ui/VideoModal';
import type { Video } from '@/lib/content';
import s from './Cinema.module.scss';

/** Pinned section: the videos travel horizontally as the page scrolls (ScrollTrigger pin + scrub). */
export default function Cinema({ videos }: { videos: Video[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(() => {
    if (prefersStill() || !track.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', () => {
      const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`; },
        },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="cinema" ref={root} className={s.cinema} aria-labelledby="cinema-title">
      <div className={s.inner}>
        <div className={s.head}>
          <h2 id="cinema-title" className={s.h}>Βίντεο</h2>
          <div className={s.meta}>
            <span className={s.label}>ΕΡΤ3 · ERTflix · Astra · YouTube</span>
            <div className={s.progress}><i ref={bar} /></div>
          </div>
        </div>
        <div ref={track} className={s.track}>
          {videos.map((v, i) => (
            <a
              key={v.title}
              href={v.href ?? '#cinema'}
              className={s.card}
              data-cursor="Play"
              onClick={(e) => { e.preventDefault(); setOpen(i); }}
            >
              <div className={s.media}>
                <Image src={v.image.src} alt="" fill sizes="(max-width: 760px) 86vw, 760px" />
                <span className={s.play}><Icon name="play" size={20} /></span>
              </div>
              <span className={s.label}>{String(i + 1).padStart(2, '0')} · {v.meta}</span>
              <h3 className={s.title}>{v.title}</h3>
            </a>
          ))}
        </div>
      </div>
      {open !== null && <VideoModal video={videos[open]} onClose={() => setOpen(null)} />}
    </section>
  );
}
