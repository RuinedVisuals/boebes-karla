'use client';

import { useExperience } from '@/components/providers/Experience';
import { NAV } from '@/lib/nav';
import s from './Nav.module.scss';

const LINKS = NAV.filter((n) => ['no1', 'halls', 'events', 'cinema', 'archive'].includes(n.target));

/** Floating glass pill. Visible section links for usability; the fullscreen menu holds the rest and the a11y switches. */
export default function Nav() {
  const { go, openMenu, menuOpen } = useExperience();
  const link = (title: string, target: string) => (e: React.MouseEvent) => { e.preventDefault(); go(title, target); };
  return (
    <header className={s.nav}>
      <a href="#hero" className={s.brand} onClick={link('Κάρλα', 'hero')} aria-label="Μουσείο Λιμναίου Πολιτισμού Κάρλας, αρχή σελίδας">
        Κάρλα <span>Νο 1</span>
      </a>
      <nav className={s.links} aria-label="Ενότητες">
        {LINKS.map((n) => (
          <a key={n.target} href={`#${n.target}`} onClick={link(n.title, n.target)}>{n.title}</a>
        ))}
      </nav>
      <div className={s.actions}>
        <a href="#visit" className={s.visit} onClick={link('Επίσκεψη', 'visit')}>Επίσκεψη</a>
        <button type="button" className={s.menu} onClick={openMenu} aria-expanded={menuOpen} aria-haspopup="dialog">ΜΕΝΟΥ</button>
      </div>
    </header>
  );
}
