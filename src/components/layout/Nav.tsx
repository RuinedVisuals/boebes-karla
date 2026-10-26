'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useExperience } from '@/components/providers/Experience';
import { NAV } from '@/lib/nav';
import s from './Nav.module.scss';

const LINKS = NAV.filter((n) => n.href !== '/syndesmoi');

/** Floating glass pill with the site's pages; the current page is marked. */
export default function Nav() {
  const { go, openMenu, menuOpen } = useExperience();
  const path = usePathname();
  const visit = (e: React.MouseEvent) => { e.preventDefault(); go('Επίσκεψη', 'visit'); };

  return (
    <header className={s.nav}>
      <Link href="/" className={s.brand} aria-label="Μουσείο Λιμναίου Πολιτισμού Κάρλας, αρχική σελίδα">
        Κάρλα <span>Μουσείο</span>
      </Link>
      <nav className={s.links} aria-label="Σελίδες">
        {LINKS.map((n) => (
          <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>
            {n.title}
          </Link>
        ))}
      </nav>
      <div className={s.actions}>
        <Link href="/#visit" className={s.visit} onClick={visit}>Επίσκεψη</Link>
        <button type="button" className={s.menu} onClick={openMenu} aria-expanded={menuOpen} aria-haspopup="dialog">ΜΕΝΟΥ</button>
      </div>
    </header>
  );
}
