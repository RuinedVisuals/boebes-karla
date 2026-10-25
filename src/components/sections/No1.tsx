'use client';

import Image from 'next/image';
import { useExperience } from '@/components/providers/Experience';
import Icon from '@/components/ui/Icon';
import s from './No1.module.scss';

/** Το Καράβι, Νο 1 — bento of the museum's flagship exhibit (intangible heritage). */
export default function No1() {
  const { go } = useExperience();
  const to = (title: string, target: string) => (e: React.MouseEvent) => { e.preventDefault(); go(title, target); };

  return (
    <section id="no1" className={s.no1} aria-labelledby="no1-title">
      <div className={s.head}>
        <h2 id="no1-title" className={s.h}>Νο <em>1</em></h2>
        <p className={s.lead}>Ένα καράβι που δεν μοιάζει με κανένα άλλο λιμνίσιο πλεούμενο στην Ελλάδα, και μια τέχνη που πέρασε από πατέρα σε γιο. Σήμερα, <b>στοιχείο άυλης πολιτιστικής κληρονομιάς</b>.</p>
      </div>
      <div className={s.bento}>
        <a href="#hall" className={`${s.card} ${s.main}`} data-cursor="Δείτε" onClick={to('Το Καράβι', 'hall')}>
          <Image src="/images/boat-nets.jpg" alt="Το καράβι της Κάρλας με τα δίχτυα του" fill sizes="(max-width: 900px) 100vw, 58vw" />
          <div className={`${s.in} ${s.shadeV}`}>
            <span className={s.label}>Έκθεμα 01 · Κεντρική αίθουσα</span>
            <div className={s.split}>
              <h3 className={s.big}>Το Καράβι<br /><em>της Κάρλας</em></h3>
              <span className={s.dot}><Icon name="arrow" /></span>
            </div>
          </div>
        </a>
        <div className={`${s.card} ${s.clay}`}>
          <div className={s.in}>
            <span className={s.label}>Υπουργείο Πολιτισμού · ΔΙΝΕΠΟΚ</span>
            <div className={s.split}>
              <span className={s.one} aria-hidden="true">1</span>
              <p className={s.serif}>Στοιχείο άυλης πολιτιστικής κληρονομιάς της Ελλάδας</p>
            </div>
          </div>
        </div>
        <a href="#archive" className={`${s.card} ${s.photo}`} data-cursor="Δείτε" onClick={to('Αρχείο', 'archive')}>
          <Image className={s.bw} src="/images/fisher-bw.jpg" alt="Ψαράς με κοντάρι πάνω στο καράβι" fill sizes="(max-width: 900px) 100vw, 25vw" />
          <div className={`${s.in} ${s.shadeB}`}><span /><span className={s.label}>Από το αρχείο · 1958</span></div>
        </a>
        <a href="#events" className={`${s.card} ${s.olive}`} data-cursor="Δείτε" onClick={to('Ημερίδα', 'events')}>
          <div className={s.in}>
            <span className={s.label}>Ημερίδα</span>
            <div><div className={s.date}>13.12</div><span className={s.label}>Κυρ. · 10:30 · 2026</span></div>
          </div>
        </a>
        <div className={`${s.card} ${s.quote}`}>
          <div className={s.in}>
            <span className={s.label}>Η τέχνη</span>
            <p className={s.serif}><em>«Η τεχνογνωσία μεταδίδεται από τον πατέρα καραβομαραγκό στον γιο.»</em></p>
          </div>
        </div>
        <a href="#cinema" className={`${s.card} ${s.video}`} data-cursor="Play" onClick={to('Βίντεο', 'cinema')}>
          <Image src="/images/fisher-castle-bw.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 66vw" />
          <div className={`${s.in} ${s.shadeH}`}>
            <span className={s.label}>ΕΡΤ3 · Βίντεο · 12.2025</span>
            <div className={s.play}>
              <span className={s.dot}><Icon name="play" /></span>
              <h3 className={s.mid}>Το Καράβι, άυλη πολιτιστική κληρονομιά</h3>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
