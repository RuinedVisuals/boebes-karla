'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import s from './Feature.module.scss';

/**
 * «Νο 1»: pinned reveal. A small framed photograph sits between the two words of the title;
 * as you scroll the words part and the frame opens to the whole screen, then the story invites you in.
 * CSS holds the final, open state, so it reads complete without JS or with motion off.
 */
export default function Feature() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersStill()) return;
    const mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 761px)', narrow: '(max-width: 760px)' }, (ctx) => {
      const wide = ctx.conditions?.wide;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=160%', pin: `.${s.stage}`, scrub: 0.8 },
      });
      tl.fromTo(`.${s.frame}`, { clipPath: wide ? 'inset(29% 37% 29% 37% round 20px)' : 'inset(30% 18% 30% 18% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, 0)
        .fromTo(`.${s.frame} img`, { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .fromTo(`.${s.shade}`, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.5)
        .fromTo(`.${s.left}`, { xPercent: 0, opacity: 1 }, { xPercent: -60, opacity: 0, duration: 0.6 }, 0)
        .fromTo(`.${s.right}`, { xPercent: 0, opacity: 1 }, { xPercent: 60, opacity: 0, duration: 0.6 }, 0)
        .fromTo(`.${s.story} > *`, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.3 }, 0.72);
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section id="karavi" ref={root} className={s.feature} aria-labelledby="feature-title">
      <div className={s.stage}>
        <div className={s.frame}>
          <Image src="/images/boat-nets.jpg" alt="Το καράβι της Κάρλας με τα δίχτυα του, στις καλαμιές" fill sizes="100vw" />
          <div className={s.shade} />
        </div>

        <div className={s.meta} aria-hidden="true">
          <span className={s.index}>01</span><span className={s.rule} /><span>Άυλη πολιτιστική κληρονομιά</span>
        </div>
        <p className={s.coords} aria-hidden="true">39°30′N · 22°51′E</p>

        <h2 id="feature-title" className={s.title}>
          <span className={s.left}>Το</span>
          <span className={s.gap} aria-hidden="true" />
          <span className={s.right}>Καράβι</span>
        </h2>

        <div className={s.story}>
          <span className={s.label}>Υπουργείο Πολιτισμού · Εθνικό Ευρετήριο</span>
          <p className={s.lead}>Ένα πλεούμενο που δεν μοιάζει με κανένα άλλο στην Ελλάδα, και μια τέχνη που περνά από τον πατέρα καραβομαραγκό στον γιο.</p>
          <div className={s.actions}>
            <Button href="/karavi" variant="cream" arrow>Η ιστορία του Καραβιού</Button>
            <span className={s.label}>Ημερίδα · 13.12.2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
