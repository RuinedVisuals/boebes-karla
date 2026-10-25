'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useExperience } from '@/components/providers/Experience';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import SplitChars from '@/components/ui/SplitChars';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import type { Hero as HeroData, SiteSettings } from '@/lib/content';
import s from './Hero.module.scss';

/** Full-bleed image or muted looping video, huge title, parallax on scroll. */
export default function Hero({ hero, settings }: { hero: HeroData; settings: SiteSettings }) {
  const { introDone } = useExperience();
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useGSAP(() => {
    if (prefersStill()) return;
    gsap.to(media.current, { yPercent: 18, scale: 1.12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(text.current, { y: 120, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '80% top', scrub: true } });
  }, { scope: root });

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <section id="hero" ref={root} className={`${s.hero} ${introDone ? s.go : ''}`}>
      <h1 className="sr-only">Μουσείο Λιμναίου Πολιτισμού Κάρλας</h1>
      <div ref={media} className={s.media}>
        {hero.video ? (
          <video ref={video} className={s.fill} src={hero.video} poster={hero.image.src} autoPlay muted loop playsInline aria-hidden="true" />
        ) : (
          <Image className={s.fill} src={hero.image.src} alt="" fill priority sizes="100vw" />
        )}
      </div>
      <div className={s.shade} aria-hidden="true" />

      <div ref={text} className={s.content}>
        <div className={`${s.row} ${s.fade}`}>
          <span className={s.chip}>{hero.caption}</span>
          <span className={s.coords}>Κανάλια Μαγνησίας · {settings.coords}</span>
        </div>
        <p className={s.title} aria-hidden="true">
          <SplitChars text="Μουσειο Λιμναιου" delay={0.1} step={0.028} play={introDone} />
          <SplitChars text="Πολιτισμου" delay={0.4} step={0.03} play={introDone} className={s.indent} />
          <SplitChars text="Καρλας" delay={0.65} step={0.04} play={introDone} className={s.accent} />
        </p>
        <div className={`${s.foot} ${s.fade}`}>
          <p className={s.intro}>{hero.intro}</p>
          <div className={s.actions}>
            <Button to="no1" toTitle="Το Καράβι" arrow>Το Καράβι, Νο 1</Button>
            <Button to="visit" variant="ghost">Επίσκεψη</Button>
            {hero.video && (
              <button type="button" className={s.round} onClick={toggle} aria-label={paused ? 'Αναπαραγωγή βίντεο' : 'Παύση βίντεο'}>
                <Icon name={paused ? 'play' : 'pause'} size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      <span className={s.scroll} aria-hidden="true">Κυλήστε ↓</span>
    </section>
  );
}
