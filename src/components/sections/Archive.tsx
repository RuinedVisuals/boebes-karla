'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, prefersStill } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import Lightbox from '@/components/ui/Lightbox';
import { archiveCategoryLabel, type ArchiveCategory, type ArchivePhoto } from '@/lib/content';
import SectionHead from '@/components/ui/SectionHead';
import s from './Archive.module.scss';

const COLS = 6;
const ROWS = 4;
const CW = 330;
const RH = 440;
const TILE_W = 280;

type Tile = ArchivePhoto & { col: number; row: number; no: string; idx: number };

/**
 * «Ο φωτεινός πίνακας»: an endless, draggable light table of the archive.
 * Tiles wrap around, drift slowly, grow toward the centre; click opens the lightbox.
 */
export default function Archive({ photos }: { photos: ArchivePhoto[] }) {
  const [cat, setCat] = useState<'all' | ArchiveCategory>('all');
  const [open, setOpen] = useState<number | null>(null);
  const table = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLAnchorElement | null)[]>([]);
  const drag = useRef({ down: false, moved: 0, lx: 0, ly: 0, vx: 0, vy: 0, ox: 0, oy: 0, sx: 0, sy: 0 });

  const tiles = useMemo<Tile[]>(() => {
    const out: Tile[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const p = photos[(r * COLS + c + r * 2) % photos.length];
      out.push({ ...p, col: c, row: r, idx: out.length, no: String(out.length + 1).padStart(2, '0') });
    }
    return out;
  }, [photos]);

  const visible = tiles.filter((t) => cat === 'all' || t.category === cat);
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: tiles.length };
    tiles.forEach((t) => { m[t.category] = (m[t.category] || 0) + 1; });
    return m;
  }, [tiles]);

  useEffect(() => {
    const el = table.current;
    if (!el) return;
    const d = drag.current;
    const TW = COLS * CW, TH = ROWS * RH;
    let inView = true;
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; });
    io.observe(el);
    const down = (e: PointerEvent) => { if (e.button !== 0) return; d.down = true; d.moved = 0; d.lx = e.clientX; d.ly = e.clientY; };
    const move = (e: PointerEvent) => {
      if (!d.down) return;
      const dx = e.clientX - d.lx, dy = e.clientY - d.ly;
      d.lx = e.clientX; d.ly = e.clientY; d.moved += Math.abs(dx) + Math.abs(dy);
      d.ox += dx; d.oy += dy; d.vx = dx; d.vy = dy;
    };
    const up = () => { d.down = false; };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    const tick = () => {
      if (!inView) return;
      const still = prefersStill();
      if (!d.down) { d.vx *= 0.93; d.vy *= 0.93; d.ox += d.vx + (still ? 0 : -0.3); d.oy += d.vy + (still ? 0 : -0.1); }
      d.sx += (d.ox - d.sx) * 0.18; d.sy += (d.oy - d.sy) * 0.18;
      const cx = el.clientWidth / 2, cy = el.clientHeight / 2;
      tiles.forEach((t, k) => {
        const node = nodes.current[k];
        if (!node) return;
        const x = ((t.col * CW + (t.row % 2) * CW * 0.5 + d.sx) % TW + TW) % TW - CW;
        const y = ((t.row * RH + (t.col % 3) * 40 + d.sy) % TH + TH) % TH - RH;
        const dist = Math.hypot(x + TILE_W / 2 - cx, y + t.height / 2 - cy);
        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(1.06 - Math.min(1, dist / 1100) * 0.3).toFixed(3)})`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [tiles]);

  const openTile = (t: Tile) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (drag.current.moved > 8) return;
    if (cat !== 'all' && t.category !== cat) return;
    setOpen(visible.findIndex((v) => v.idx === t.idx));
  };

  return (
    <section id="archive" className={s.archive} aria-labelledby="archive-title">
      <div ref={table} className={s.table} data-cursor="Σύρετε">
        {tiles.map((t, k) => (
          <a
            key={t.idx}
            ref={(el) => { nodes.current[k] = el; }}
            href="#archive"
            draggable={false}
            className={`${s.tile} ${cat !== 'all' && t.category !== cat ? s.dim : ''}`}
            data-cursor="Δείτε"
            aria-label={`${t.caption}, ${t.year}: μεγέθυνση`}
            tabIndex={cat !== 'all' && t.category !== cat ? -1 : 0}
            onClick={openTile(t)}
          >
            <figure>
              <div className={s.ph} style={{ height: t.height }}><img src={t.image.src} alt="" draggable={false} loading="lazy" /></div>
              <figcaption><span>{t.no} — {t.caption}</span><span>{t.year}</span></figcaption>
            </figure>
          </a>
        ))}
      </div>
      <div className={s.panel}>
        <SectionHead index="06" kicker="Φωτογραφικό αρχείο" title="Ό,τι θυμάται η λίμνη" id="archive-title" />
        <div className={s.chips} role="group" aria-label="Κατηγορίες φωτογραφιών">
          {(['all', 'karavi', 'fishing', 'louro', 'drainage'] as const).map((c) => (
            <button key={c} type="button" className={s.chip} aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === 'all' ? 'Όλες' : archiveCategoryLabel[c]} <small>{counts[c] ?? 0}</small>
            </button>
          ))}
        </div>
        <div className={s.actions}><Button to="archive" toTitle="Αρχείο" variant="ink">Όλο το αρχείο</Button><span className={s.kicker}>Σύρετε · κλικ για μεγέθυνση</span></div>
      </div>
      {open !== null && <Lightbox photos={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
