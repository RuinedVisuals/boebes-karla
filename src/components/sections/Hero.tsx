'use client';

import { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/components/providers/Experience';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import { HeroVideoScene } from '@/webgl/heroVideo';
import SplitChars from '@/components/ui/SplitChars';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import type { Hero as HeroData, SiteSettings } from '@/lib/content';
import s from './Hero.module.scss';

/**
 * Museum footage graded dark through WebGL (liquid drift, pointer ripple, grain).
 * On scroll the film recedes into a framed window — the page "steps back" into the museum.
 */
export default function Hero({ hero, settings }: { hero: HeroData; settings: SiteSettings }) {
  const { introDone } = useExperience();
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const scene = useRef<HeroVideoScene | null>(null);
  const [glOk, setGlOk] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hasVideo, setHasVideo] = useState(!!hero.video);

  // The film may fail before hydration (e.g. not uploaded yet): detect that too, then fall back to the image.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const fail = () => setHasVideo(false);
    if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) fail();
    v.addEventListener('error', fail);
    return () => v.removeEventListener('error', fail);
  }, []);

  useEffect(() => {
    if (!canvas.current) return;
    const sc = HeroVideoScene.create(canvas.current, video.current, hero.image.src, prefersStill);
    scene.current = sc;
    if (!sc) setGlOk(false);
    return () => { sc?.destroy(); scene.current = null; };
  }, [hero.image.src]);

  useEffect(() => {
    const sc = scene.current;
    if (!sc || !introDone) return;
    if (prefersStill()) { sc.intro = 1; return; }
    gsap.to(sc, { intro: 1, duration: 2.4, ease: 'power2.out' });
  }, [introDone]);

  useGSAP(() => {
    if (prefersStill()) return;
    const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.fromTo(frame.current, { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(7% 4% 7% 4% round 22px)', ease: 'none', scrollTrigger: st });
    gsap.to(text.current, { y: -80, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '70% top' } });
    gsap.to({}, { scrollTrigger: { ...st, onUpdate: (self) => { if (scene.current) scene.current.scroll = self.progress; } } });
  }, { scope: root });

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <section id="hero" ref={root} className={`${s.hero} ${introDone ? s.go : ''}`}>
      <h1 className="sr-only">Μουσείο Λιμναίου Πολιτισμού Κάρλας</h1>
      <div ref={frame} className={s.frame}>
        {hasVideo && (
          <video
            ref={video}
            className={glOk ? s.source : s.fallbackVideo}
            src={hero.video ?? undefined}
            poster={hero.image.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setHasVideo(false)}
          />
        )}
        <canvas ref={canvas} className={s.canvas} aria-hidden="true" />
        {!glOk && !hasVideo && <img className={s.fallbackVideo} src={hero.image.src} alt="" />}
      </div>

      <div ref={text} className={s.content}>
        <div className={`${s.row} ${s.fade}`}>
          <span className={s.chip}><i className={s.dot} aria-hidden="true" />{hero.caption}</span>
          <span className={s.meta}>{hero.credit && <span className={s.credit}>{hero.credit}</span>}<span className={s.coords}>{settings.coords}</span></span>
        </div>
        <p className={s.title} aria-hidden="true">
          <SplitChars text="Μουσειο Λιμναιου" delay={0.1} step={0.028} play={introDone} />
          <SplitChars text="Πολιτισμου" delay={0.4} step={0.03} play={introDone} className={s.indent} />
          <SplitChars text="Καρλας" delay={0.65} step={0.04} play={introDone} className={s.accent} />
        </p>
        <div className={`${s.foot} ${s.fade}`}>
          <p className={s.intro}>{hero.intro}</p>
          <div className={s.actions}>
            <Button to="karavi" toTitle="Το Καράβι" arrow>Το Καράβι της Κάρλας</Button>
            <Button to="visit" variant="ghost">Επίσκεψη</Button>
            {hasVideo && (
              <button type="button" className={s.round} onClick={toggle} aria-label={paused ? 'Αναπαραγωγή βίντεο' : 'Παύση βίντεο'}>
                <Icon name={paused ? 'play' : 'pause'} size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
