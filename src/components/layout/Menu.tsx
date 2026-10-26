'use client';

import { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/components/providers/Experience';
import { MenuStage } from '@/webgl/menuStage';
import { NAV } from '@/lib/nav';
import { prefersStill } from '@/lib/gsap';
import s from './Menu.module.scss';

/** Fullscreen menu. Opens and closes with the wave; WebGL image morph on hover. */
export default function Menu() {
  const { closeMenu, go, settings } = useExperience();
  const [active, setActive] = useState(0);
  const [closing, setClosing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<MenuStage | null>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [glOk, setGlOk] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !stageRef.current) return;
    const scene = MenuStage.create(canvasRef.current, stageRef.current, NAV.map((n) => n.image), prefersStill);
    sceneRef.current = scene;
    setGlOk(!!scene);
    firstLink.current?.focus({ preventScroll: true });
    return () => scene?.destroy();
  }, []);

  useEffect(() => { sceneRef.current?.show(active); }, [active]);

  const shut = () => {
    if (closing) return;
    if (prefersStill()) { closeMenu(); return; }
    setClosing(true);
    window.setTimeout(closeMenu, 950);
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Escape') shut(); };
  const item = NAV[active];

  return (
    <div className={`${s.menu} ${closing ? s.out : s.in}`} role="dialog" aria-modal="true" aria-label="Κύριο μενού" onKeyDown={onKey}>
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />

      <div className={s.top}>
        <span className={s.brand}>Κάρλα <small>Μουσείο Λιμναίου Πολιτισμού</small></span>
        <button type="button" className={s.close} onClick={shut} aria-label="Κλείσιμο μενού">
          ΚΛΕΙΣΙΜΟ
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>
        </button>
      </div>

      <div className={s.grid}>
        <nav aria-label="Ενότητες">
          <ul className={s.list}>
            {NAV.map((n, i) => (
              <li key={n.target}>
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${n.target}`}
                  className={`${s.item} ${i === active ? s.on : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={(e) => { e.preventDefault(); go(n.title, n.target, n.num); }}
                >
                  <span className={s.num}>{n.num}</span>
                  <span className={s.title}>{n.title}</span>
                  <span className={s.desc}>{n.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={s.stageCol}>
          <div ref={stageRef} className={s.stage}>
            {!glOk && <img src={item.image} alt="" className={s.fallback} />}
          </div>
          <div className={s.caption}><span>{item.caption}</span><span className={s.count}>{item.num} / {String(NAV.length).padStart(2, '0')}</span></div>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.group}>
          <span className={s.label}>Επίσκεψη · Κανάλια Μαγνησίας</span>
          <a href={`tel:${settings.phone}`} className={s.phone}>{settings.phoneDisplay}</a>
          <a href={`mailto:${settings.email}`} className={s.mail}>{settings.email}</a>
        </div>
        <div className={s.group}>
          <span className={s.label}>Ώρες λειτουργίας</span>
          <span className={s.text}>{settings.hours ?? 'Κατόπιν ραντεβού'}</span>
          <a className={s.textLink} href="https://www.google.com/maps/dir/?api=1&destination=39.5009492,22.8852162" target="_blank" rel="noopener noreferrer">{settings.address} · Οδηγίες ↗</a>
        </div>
        <div className={s.group}>
          <span className={s.label}>Σχολεία & ομάδες</span>
          <span className={s.text}>Εκπαιδευτικά προγράμματα για 6–15 ετών</span>
          <a className={s.textLink} href="#events" onClick={(e) => { e.preventDefault(); go('Εκπαίδευση', 'events', '04'); }}>Δείτε τα προγράμματα →</a>
        </div>
        <div className={s.group}>
          <span className={s.label}>Περιήγηση 360°</span>
          <div className={s.row}>
            <a className={s.tool} href={settings.virtualTourUrl} target="_blank" rel="noopener noreferrer">Virtual Tour ↗</a>
            <a className={s.tool} href={settings.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </div>
  );
}
