'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { useExperience } from '@/components/providers/Experience';
import { archiveCategoryLabel, type ArchivePhoto } from '@/lib/content';
import s from './Lightbox.module.scss';

type Props = { photos: ArchivePhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void };

/**
 * Archive lightbox, Fancybox-style: toolbar with counter, the photo fitted to the free space,
 * side arrows, caption, thumbnail strip. Click the photo to zoom (it follows the pointer),
 * swipe on touch, arrows/Esc on the keyboard, click the backdrop to close.
 */
export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const { lenis } = useExperience();
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const touch = useRef<number | null>(null);
  const p = photos[index];
  const step = (d: number) => { setZoom(false); onIndex((index + d + photos.length) % photos.length); };

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    root.current?.focus();
    lenis()?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => { lenis()?.start(); document.documentElement.style.overflow = ''; prev?.focus?.(); };
  }, [lenis]);

  // Keep the current thumbnail in view.
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index]);

  if (!p) return null;
  const meta = [p.year, p.photographer].filter(Boolean).join(' · ');

  return createPortal(
    <div
      ref={root}
      tabIndex={-1}
      className={s.box}
      role="dialog"
      aria-modal="true"
      aria-label={`Φωτογραφία αρχείου: ${p.caption}`}
      onKeyDown={(e) => {
        if (e.key === 'Escape') { if (zoom) setZoom(false); else onClose(); }
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'ArrowLeft') step(-1);
      }}
    >
      <div className={s.backdrop} onClick={onClose} aria-hidden="true" />

      <div className={s.toolbar}>
        <span className={s.counter}>{String(index + 1).padStart(2, '0')} <i>/</i> {String(photos.length).padStart(2, '0')}</span>
        <div className={s.tools}>
          <button type="button" className={s.tool} onClick={() => setZoom((z) => !z)} aria-pressed={zoom} aria-label={zoom ? 'Σμίκρυνση' : 'Μεγέθυνση'}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M12.5 12.5L17 17" stroke="currentColor" strokeWidth="1.5" />{!zoom && <path d="M8 5v6" stroke="currentColor" strokeWidth="1.5" />}<path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <button type="button" className={s.tool} onClick={onClose} aria-label="Κλείσιμο"><Icon name="close" size={16} /></button>
        </div>
      </div>

      <div
        className={s.stage}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null || zoom) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <img
          key={index}
          className={`${s.photo} ${zoom ? s.zoomed : ''}`}
          style={{ transformOrigin: origin }}
          src={p.image.src}
          alt={p.image.alt}
          draggable={false}
          onClick={() => setZoom((z) => !z)}
          onPointerMove={(e) => {
            if (!zoom) return;
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
          }}
        />
        <button type="button" className={`${s.arrow} ${s.prev}`} onClick={() => step(-1)} aria-label="Προηγούμενη φωτογραφία"><Icon name="prev" /></button>
        <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => step(1)} aria-label="Επόμενη φωτογραφία"><Icon name="next" /></button>
      </div>

      <div className={s.caption} aria-live="polite">
        <span className={s.cat}>{archiveCategoryLabel[p.category]}</span>
        <span className={s.title}>{p.caption}</span>
        {meta && <span className={s.meta}>{meta}</span>}
      </div>

      <div ref={strip} className={s.thumbs} role="group" aria-label="Μικρογραφίες">
        {photos.map((ph, i) => (
          <button key={i} type="button" className={s.thumb} aria-current={i === index ? 'true' : undefined} aria-label={`${ph.caption} (${i + 1})`} onClick={() => { setZoom(false); onIndex(i); }}>
            <img src={ph.image.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
