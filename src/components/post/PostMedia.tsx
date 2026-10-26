'use client';

import { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Lightbox from '@/components/ui/Lightbox';
import type { ArchivePhoto } from '@/lib/content';
import s from './Post.module.scss';

/** Cover: the photo, or a YouTube poster that loads the player only when pressed. */
export function PostCover({ src, alt, youtubeId }: { src: string; alt: string; youtubeId?: string }) {
  const [play, setPlay] = useState(false);
  if (youtubeId && play) {
    return (
      <div className={s.cover}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`} title={alt} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  }
  return (
    <div className={s.cover}>
      <Image src={src} alt={alt} fill priority sizes="(max-width: 1750px) 100vw, 1750px" />
      {youtubeId && (
        <button type="button" className={s.play} onClick={() => setPlay(true)} data-cursor="Play">
          <Icon name="play" size={22} /><span>Δείτε το βίντεο</span>
        </button>
      )}
    </div>
  );
}

/** Photo grid that opens the site's lightbox. */
export function PostGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const photos: ArchivePhoto[] = images.map((src, i) => ({ caption: `${title} · ${i + 1}`, year: '', category: 'museum', photographer: 'ΚΕ.ΜΕ.ΒΟ.', image: { src, alt: `${title}, εικόνα ${i + 1}` }, height: 0 }));
  return (
    <>
      <ul className={s.gallery}>
        {images.map((src, i) => (
          <li key={src}>
            <button type="button" onClick={() => setOpen(i)} data-cursor="Δείτε" aria-label={`Μεγέθυνση εικόνας ${i + 1}`}>
              <Image src={src} alt="" fill sizes="(max-width: 760px) 50vw, 25vw" />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}
