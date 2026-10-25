'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { useExperience } from '@/components/providers/Experience';
import { archiveCategoryLabel, type ArchivePhoto } from '@/lib/content';
import s from './Overlay.module.scss';

type Props = { photos: ArchivePhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void };

/** Archive lightbox: caption, year, category, counter; arrows, Esc and buttons. */
export default function Lightbox({ photos, index, onIndex, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { lenis } = useExperience();
  const p = photos[index];
  const step = (d: number) => onIndex((index + d + photos.length) % photos.length);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    root.current?.focus();
    lenis()?.stop();
    return () => { lenis()?.start(); prev?.focus?.(); };
  }, [lenis]);

  if (!p) return null;
  return createPortal(
    <div
      ref={root}
      tabIndex={-1}
      className={`${s.overlay} ${s.lightbox}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Φωτογραφία αρχείου: ${p.caption}`}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1); }}
    >
      <div className={s.bar}>
        <span className={s.label}>Αρχείο · {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')} · {archiveCategoryLabel[p.category]}</span>
        <button type="button" className={s.round} onClick={onClose} aria-label="Κλείσιμο"><Icon name="close" size={16} /></button>
      </div>
      <div className={s.stage}>
        <img key={index} className={s.photo} src={p.image.src} alt={p.image.alt} />
      </div>
      <div className={s.foot}>
        <div>
          <div className={s.cap}>{p.caption}</div>
          <span className={s.label}>{p.year}{p.photographer ? ` · ${p.photographer}` : ''}</span>
        </div>
        <div className={s.row}>
          <button type="button" className={s.round} onClick={() => step(-1)} aria-label="Προηγούμενη φωτογραφία"><Icon name="prev" /></button>
          <button type="button" className={s.round} onClick={() => step(1)} aria-label="Επόμενη φωτογραφία"><Icon name="next" /></button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
