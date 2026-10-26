'use client';

import { useState } from 'react';
import SectionHead from '@/components/ui/SectionHead';
import Icon from '@/components/ui/Icon';
import s from './KaraviFilms.module.scss';

// From the museum's YouTube channel, as listed on the current «Το Καράβι» page.
const FILMS = [
  { id: 'VsFQtBPJMyI', title: 'Το Καράβι της Κάρλας και η εξέλιξή του' },
  { id: 'd1hd8Ys11cQ', title: 'Το «Καράβι» της λίμνης Κάρλας' },
  { id: 'tfn-oMWXS7A', title: 'Κατασκευή Καραβιού, μέρος 1ο' },
  { id: 'VMCSL4n7n3c', title: 'Κατασκευή Καραβιού, μέρος 2ο' },
  { id: 'Do3EgDs8HJQ', title: 'Κατασκευή του πρώτου Καραβιού' },
  { id: 'dsvG1rB8Xh4', title: 'Κατασκευή και ομιλίες για το Καράβι' },
];

/** A short film series: one large screen, the episodes listed beside it. YouTube loads only after «play». */
export default function KaraviFilms() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const film = FILMS[current];
  const pick = (i: number) => { setCurrent(i); setPlaying(true); };

  return (
    <section id="films" className={s.films} aria-labelledby="films-title">
      <div className={s.grid}>
        <SectionHead index="03" kicker="Ταινίες" title="Πώς φτιάχνεται ένα καράβι" id="films-title" className={s.head} />

        <div className={s.screen}>
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&rel=0`}
              title={film.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button type="button" className={s.poster} onClick={() => setPlaying(true)} data-cursor="Play">
              {/* eslint-disable-next-line @next/next/no-img-element -- remote YouTube thumbnail */}
              <img src={`https://i.ytimg.com/vi/${film.id}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className={s.play}><Icon name="play" size={22} /></span>
              <span className={s.posterTitle}>{film.title}</span>
              <span className="sr-only">Αναπαραγωγή βίντεο</span>
            </button>
          )}
        </div>

        <ol className={s.list}>
          {FILMS.map((f, i) => (
            <li key={f.id}>
              <button type="button" className={s.item} aria-current={i === current ? 'true' : undefined} onClick={() => pick(i)}>
                <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.itemTitle}>{f.title}</span>
                <Icon name="play" size={16} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
