'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { useExperience } from '@/components/providers/Experience';
import type { Video } from '@/lib/content';
import s from './Overlay.module.scss';

/** Full-screen player. YouTube loads only after opening (no cookies before the click, via youtube-nocookie). */
export default function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const { lenis } = useExperience();
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    lenis()?.stop();
    return () => { lenis()?.start(); prev?.focus?.(); };
  }, [lenis]);

  return createPortal(
    <div className={`${s.overlay} ${s.dark}`} role="dialog" aria-modal="true" aria-label={video.title} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <div className={s.box}>
        <div className={s.bar}>
          <span className={s.label}>{video.meta}</span>
          <button ref={closeBtn} type="button" className={s.round} onClick={onClose} aria-label="Κλείσιμο βίντεο"><Icon name="close" size={16} /></button>
        </div>
        <div className={s.player}>
          {video.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&cc_load_policy=1&hl=el`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img src={video.image.src} alt="" />
              <div className={s.note}>
                <p>Το βίντεο θα παίζει εδώ μόλις οριστεί το YouTube ID στο Sanity.</p>
                {video.href && <a href={video.href} target="_blank" rel="noopener noreferrer">Δείτε το στην πηγή ↗</a>}
              </div>
            </>
          )}
        </div>
        <h3 className={s.title}>{video.title}</h3>
      </div>
    </div>,
    document.body,
  );
}
