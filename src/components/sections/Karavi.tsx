'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import SectionHead from '@/components/ui/SectionHead';
import Button from '@/components/ui/Button';
import s from './Karavi.module.scss';

const CHAPTERS = [
  {
    title: 'Μια παράδοση στα βάθη του χρόνου',
    text: 'Το «Καράβι της λίμνης Κάρλας» είναι χαρακτηριστικό δείγμα της ντόπιας παραδοσιακής ναυπηγικής της Θεσσαλίας. Για εκατοντάδες χρόνια βρισκόταν στο επίκεντρο της οικονομικής και κοινωνικής ζωής των παραλίμνιων οικισμών της Μαγνησίας και της Λάρισας.',
    image: '/images/boat-nets.jpg',
    alt: 'Το καράβι της Κάρλας με τα δίχτυα του, δεμένο στις καλαμιές',
    caption: 'Το καράβι με τα δίχτυα του · από την έκθεση',
  },
  {
    title: 'Ένα καράβι με ξεχωριστή ταυτότητα',
    text: 'Ιδιαίτερα μορφολογικά χαρακτηριστικά και μοναδικός εξοπλισμός: η μορφή του διαφέρει από κάθε άλλο λιμνίσιο ή ποτάμιο πλεούμενο στην Ελλάδα. Πλατύ, ρηχό, φτιαγμένο για τα νερά και τις καλαμιές της Κάρλας.',
    image: '/images/fisher-castle-bw.jpg',
    alt: 'Ψαράς όρθιος με κοντάρι πάνω στο καράβι, στη λίμνη',
    caption: 'Ο ψαράς και το κοντάρι · αρχείο',
  },
  {
    title: 'Η τέχνη που περνά από γενιά σε γενιά',
    text: 'Η τεχνογνωσία μεταδίδεται από τον πατέρα καραβομαραγκό στον γιο, μέσα από την προφορική παράδοση και την πρακτική εφαρμογή. Η διάσωσή της είναι προϋπόθεση για την πολιτιστική ταυτότητα του τόπου.',
    image: '/images/archive/a03.webp',
    alt: 'Το καράβι στο μουσείο από το πλάι, με τα κοντάρια, τα καλάθια και τα πήλινα',
    caption: 'Το καράβι στην κεντρική αίθουσα · μουσείο',
  },
];

/**
 * Το Καράβι: sticky framed image on the left, three chapters on the right.
 * Each chapter that reaches the centre wipes its image in (MIT-Museum-style reveal, kept quiet).
 */
export default function Karavi() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const items = root.current?.querySelectorAll<HTMLElement>(`.${s.chapter}`) ?? [];
    items.forEach((el, i) => {
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => { if (self.isActive) setActive(i); } });
    });
  }, { scope: root });

  return (
    <section id="karavi" ref={root} className={s.karavi} aria-labelledby="karavi-title">
      <div className={s.top}>
        <SectionHead index="01" kicker="Στοιχείο άυλης πολιτιστικής κληρονομιάς" title="Το Καράβι της Λίμνης Κάρλας" id="karavi-title" />
        <div className={s.badge}>
          <span className={s.badgeLabel}>Υπουργείο Πολιτισμού · ΔΙΝΕΠΟΚ</span>
          <p>Εγγεγραμμένο στο Εθνικό Ευρετήριο Άυλης Πολιτιστικής Κληρονομιάς.</p>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.stage}>
          <div className={s.frame}>
            {CHAPTERS.map((c, i) => (
              <figure key={c.image} className={`${s.shot} ${i === active ? s.on : ''} ${i < active ? s.past : ''}`} aria-hidden={i !== active}>
                <Image src={c.image} alt={c.alt} fill sizes="(max-width: 980px) 100vw, 50vw" />
              </figure>
            ))}
            <div className={s.counter} aria-hidden="true">
              {CHAPTERS.map((_, i) => <i key={i} className={i === active ? s.cur : ''} />)}
            </div>
          </div>
          <p className={s.caption} aria-live="polite">{CHAPTERS[active].caption}</p>
        </div>

        <ol className={s.chapters}>
          {CHAPTERS.map((c, i) => (
            <li key={c.title} className={`${s.chapter} ${i === active ? s.current : ''}`}>
              <div className={s.mobileShot}><Image src={c.image} alt={c.alt} fill sizes="100vw" /></div>
              <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.chapterTitle}>{c.title}</h3>
              <p className={s.text}>{c.text}</p>
            </li>
          ))}
          <li className={s.closing}>
            <ul className={s.pillars} aria-label="Τρεις πυλώνες για το μέλλον">
              <li>Πολιτισμός</li><li>Τουρισμός</li><li>Τοπική ανάπτυξη</li>
            </ul>
            <div className={s.event}>
              <span className={s.badgeLabel}>Ημερίδα</span>
              <p className={s.eventDate}>Κυριακή 13 Δεκεμβρίου 2026 · 10:30</p>
              <p className={s.eventText}>Ναυπήγηση, τεχνικά χαρακτηριστικά, συνεντεύξεις καραβομαραγκών και προβολές βίντεο, στο μουσείο.</p>
            </div>
            <div className={s.actions}>
              <Button to="films" toTitle="Ταινίες" arrow>Δείτε τις ταινίες</Button>
              <Button to="boat" toTitle="Το έκθεμα" variant="line">Το καράβι από κοντά</Button>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
