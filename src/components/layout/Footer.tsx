'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap, useGSAP, prefersStill } from '@/lib/gsap';
import { useExperience } from '@/components/providers/Experience';
import { NAV } from '@/lib/nav';
import type { SiteSettings } from '@/lib/content';
import s from './Footer.module.scss';

const WORD = 'Κάρλα';

/** Local time at the museum, so the footer feels like a window onto the place. */
function useKanaliaTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('el-GR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens' });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

/**
 * Closing spread (the Επίσκεψη section above carries the invitation): four columns of what visitors need,
 * then the giant «Κάρλα» whose letters rise into place as the footer arrives.
 */
export default function Footer({ settings }: { settings: SiteSettings }) {
  const root = useRef<HTMLElement>(null);
  const time = useKanaliaTime();
  const { lenis } = useExperience();

  useGSAP(() => {
    if (prefersStill()) return;
    gsap.from(`.${s.ch}`, {
      yPercent: 100,
      ease: 'none',
      stagger: 0.08,
      scrollTrigger: { trigger: `.${s.word}`, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    });
  }, { scope: root });

  const top = () => {
    const l = lenis();
    if (l) l.scrollTo(0, { duration: prefersStill() ? 0 : 1.6 });
    else window.scrollTo({ top: 0, behavior: prefersStill() ? 'auto' : 'smooth' });
  };

  return (
    <footer ref={root} className={s.footer}>
      <div className={s.grid}>
        <div className={s.col}>
          <h2 className={s.label}>Επίσκεψη</h2>
          <p>{settings.address}</p>
          <p>{settings.hours ?? 'Κατόπιν ραντεβού'}</p>
          <a className={s.big} href={`tel:${settings.phone}`}>{settings.phoneDisplay}</a>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </div>
        <nav className={s.col} aria-label="Σελίδες">
          <h2 className={s.label}>Το μουσείο</h2>
          <ul>
            {NAV.map((n) => <li key={n.href}><Link href={n.href}>{n.title}</Link></li>)}
          </ul>
        </nav>
        <div className={s.col}>
          <h2 className={s.label}>Ακολουθήστε</h2>
          <ul>
            <li><a href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a></li>
            <li><a href={settings.youtube} target="_blank" rel="noopener noreferrer">YouTube ↗</a></li>
            <li><a href={settings.virtualTourUrl} target="_blank" rel="noopener noreferrer">Virtual Tour 360° ↗</a></li>
          </ul>
        </div>
        <div className={s.col}>
          <h2 className={s.label}>Κανάλια, τώρα</h2>
          <p className={s.clock} aria-live="off"><span className={s.dot} aria-hidden="true" />{time || '—'}</p>
          <p className={s.muted}>{settings.coords}</p>
          <p className={s.muted}>~25 χλμ. ΒΔ του Βόλου</p>
        </div>
      </div>

      <p className={s.word} aria-hidden="true">
        {Array.from(WORD).map((c, i) => <span key={i} className={s.mask}><span className={s.ch}>{c}</span></span>)}
      </p>

      <div className={s.bar}>
        <span>© {new Date().getFullYear()} ΚΕ.ΜΕ.ΒΟ. · Μουσείο Λιμναίου Πολιτισμού Κάρλας</span>
        <button type="button" className={s.top} onClick={top}>Πάνω <span aria-hidden="true">↑</span></button>
      </div>
    </footer>
  );
}
