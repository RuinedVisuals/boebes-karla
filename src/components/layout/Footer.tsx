'use client';

import { useRef } from 'react';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import type { SiteSettings } from '@/lib/content';
import s from './Footer.module.scss';

export default function Footer({ settings }: { settings: SiteSettings }) {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (prefersStill()) return;
    gsap.from(word.current, { yPercent: 40, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }, { scope: root });

  return (
    <footer ref={root} className={s.footer}>
      <div className={s.row}>
        <span className={s.muted}>Μουσείο Λιμναίου Πολιτισμού Κάρλας · ΚΕ.ΜΕ.ΒΟ.</span>
        <nav className={s.links} aria-label="Υποσέλιδο">
          <a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={settings.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href={settings.virtualTourUrl} target="_blank" rel="noopener noreferrer">Virtual Tour</a>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </nav>
      </div>
      <p ref={word} className={s.giant} aria-hidden="true">Κάρλα</p>
    </footer>
  );
}
