'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, prefersStill } from '@/lib/gsap';
import SectionHead from '@/components/ui/SectionHead';
import type { BoatScene } from '@/webgl/boat';
import s from './BoatStage.module.scss';

// Points on the 3D boat (boat-local coordinates) and where the camera stands to look at each.
const SPOTS = [
  { p: [3.3, 0.9, 0.55], cam: [4.4, 1.5, 4.6], title: 'Η πλώρη με το «1»', text: 'Η ψηλή μυτερή άκρη, με το νούμερο «1» βαμμένο στα πλαϊνά.' },
  { p: [1.8, 0.62, 0], cam: [3.2, 3.2, 3.4], title: 'Τα καθίσματα', text: 'Δύο πάγκοι στο μπροστινό μέρος, για τον ψαρά και τα εργαλεία του.' },
  { p: [-0.5, 0.45, -0.55], cam: [-1.2, 3.6, -3.4], title: 'Πλατύ, ρηχό κύτος', text: 'Επίπεδος πάτος και ανοιχτά πλαϊνά με νομείς (πλευρά), για να πατά σταθερά στις καλαμιές.' },
  { p: [0.2, 0.3, 0.15], cam: [1.4, 2.6, 2.2], title: 'Το καλάθι', text: 'Καλαμένιο καλάθι για τα ψάρια της ημέρας.' },
  { p: [-1.6, 0.85, 1.4], cam: [-4.2, 2.6, 4.6], title: 'Το δοκάρι και τα κουπιά', text: 'Ένα δοκάρι περνά πάνω από το καράβι και κρατά τα δύο μακριά κουπιά. Πίσω, η πρύμνη κλείνει με ίσια σανίδα και τα πλαϊνά περνούν λίγο έξω από αυτήν.' },
] as const;

/**
 * The boat in 3D: drag to turn it; pick a point to send the camera there.
 * The 3D library loads only when this section mounts; without WebGL the gallery photo stands in.
 */
export default function BoatStage() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const marks = useRef<(HTMLButtonElement | null)[]>([]);
  const scene = useRef<BoatScene | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [glOk, setGlOk] = useState(true);

  useEffect(() => {
    let live = true;
    let instance: BoatScene | null = null;
    import('@/webgl/boat').then(async ({ BoatScene }) => {
      const THREE = await import('three');
      if (!live || !canvas.current) return;
      instance = BoatScene.create(canvas.current, prefersStill());
      if (!instance) { setGlOk(false); return; }
      instance.markers = SPOTS.map((sp) => new THREE.Vector3(...sp.p));
      instance.onMarkers = (pts) => pts.forEach((pt, i) => {
        const el = marks.current[i];
        if (!el) return;
        el.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0)`;
        el.style.opacity = pt.behind ? '0' : '1';
      });
      scene.current = instance;
    });
    return () => { live = false; instance?.destroy(); scene.current = null; };
  }, []);

  const go = (i: number) => {
    setActive(i);
    const sc = scene.current;
    if (!sc) return;
    const sp = SPOTS[i];
    sc.controls.autoRotate = false;
    const t = { x: sp.p[0], y: sp.p[1] + sc.boat.position.y, z: sp.p[2] };
    const d = prefersStill() ? 0 : 1.6;
    gsap.to(sc.camera.position, { x: sp.cam[0], y: sp.cam[1], z: sp.cam[2], duration: d, ease: 'power3.inOut' });
    gsap.to(sc.controls.target, { ...t, duration: d, ease: 'power3.inOut' });
  };

  const spot = active === null ? null : SPOTS[active];

  return (
    <section id="boat" className={s.boat} aria-labelledby="boat-title">
      <div className={s.head}>
        <SectionHead index="02" kicker="Το έκθεμα σε 3D" title="Γνωρίστε το καράβι από κοντά" id="boat-title" tone="light" />
        <p className={s.hint}>Σύρετε για να το γυρίσετε · επιλέξτε ένα σημείο</p>
      </div>

      <div className={s.stage}>
        {glOk ? (
          <canvas ref={canvas} className={s.canvas} data-cursor="Σύρετε" role="img" aria-label="Τρισδιάστατο μοντέλο του καραβιού της Κάρλας. Σύρετε για να το περιστρέψετε." />
        ) : (
          <Image src="/images/karavi-hall.webp" alt="Το καράβι της Κάρλας στην κεντρική αίθουσα του μουσείου" fill sizes="100vw" className={s.fallback} />
        )}
        {glOk && SPOTS.map((sp, i) => (
          <button
            key={sp.title}
            ref={(el) => { marks.current[i] = el; }}
            type="button"
            className={s.mark}
            aria-pressed={i === active}
            onClick={() => go(i)}
          >
            <span className="sr-only">{sp.title}</span>
            <span aria-hidden="true">{i + 1}</span>
          </button>
        ))}
      </div>

      <div className={s.foot}>
        <ol className={s.index}>
          {SPOTS.map((sp, i) => (
            <li key={sp.title}>
              <button type="button" className={s.row} aria-pressed={i === active} aria-controls="boat-note" onClick={() => go(i)}>
                <span className={s.n}>{String(i + 1).padStart(2, '0')}</span>
                <span>{sp.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div id="boat-note" key={active ?? 'intro'} className={s.note} aria-live="polite">
          <h3 className={s.noteTitle}>{spot ? spot.title : 'Πλατσίδα της Κάρλας'}</h3>
          <p className={s.noteText}>{spot ? spot.text : 'Ψηφιακή αναπαράσταση του καραβιού της λίμνης, με βάση το έκθεμα του μουσείου. Επιλέξτε ένα σημείο για να το δείτε από κοντά.'}</p>
        </div>
      </div>
    </section>
  );
}
