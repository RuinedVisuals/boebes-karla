'use client';

import { useEffect, useState } from 'react';
import { useExperience } from '@/components/providers/Experience';
import { NAV } from '@/lib/nav';
import s from './Nav.module.scss';

const LINKS = NAV.filter((n) => ['karavi', 'halls', 'events', 'cinema', 'archive'].includes(n.target));

/** Floating glass pill with section links; the current section is marked (scrollspy) so visitors always know where they are. */
export default function Nav() {
  const { go, openMenu, menuOpen } = useExperience();
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const ids = NAV.map((n) => n.target);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setCurrent(hit.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.01] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const link = (title: string, target: string, num?: string) => (e: React.MouseEvent) => { e.preventDefault(); go(title, target, num); };

  return (
    <header className={s.nav}>
      <a href="#hero" className={s.brand} onClick={link('Κάρλα', 'hero')} aria-label="Μουσείο Λιμναίου Πολιτισμού Κάρλας, αρχή σελίδας">
        Κάρλα <span>Μουσείο</span>
      </a>
      <nav className={s.links} aria-label="Ενότητες">
        {LINKS.map((n) => (
          <a key={n.target} href={`#${n.target}`} aria-current={current === n.target ? 'true' : undefined} onClick={link(n.title, n.target, n.num)}>
            {n.title}
          </a>
        ))}
      </nav>
      <div className={s.actions}>
        <a href="#visit" className={s.visit} onClick={link('Επίσκεψη', 'visit', '07')}>Επίσκεψη</a>
        <button type="button" className={s.menu} onClick={openMenu} aria-expanded={menuOpen} aria-haspopup="dialog">ΜΕΝΟΥ</button>
      </div>
    </header>
  );
}
