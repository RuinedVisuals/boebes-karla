'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersStill } from '@/lib/gsap';
import Cover from '@/components/layout/Cover';
import Menu from '@/components/layout/Menu';
import Cursor from '@/components/layout/Cursor';
import type { SiteSettings } from '@/lib/content';

type TextSize = 'm' | 'l' | 'xl';
type CoverState = { title: string; num: string; phase: 'hold' | 'in' | 'out' } | null;

type Ctx = {
  settings: SiteSettings;
  introDone: boolean;
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  /** Cinematic transition: wave covers the screen, shows `title`, jumps to `target`, wave lifts. */
  go: (title: string, target?: string | null, num?: string) => void;
  textSize: TextSize;
  setTextSize: (s: TextSize) => void;
  contrast: boolean;
  setContrast: (v: boolean) => void;
  motionOff: boolean;
  setMotionOff: (v: boolean) => void;
  lenis: () => Lenis | null;
};

const ExperienceContext = createContext<Ctx | null>(null);

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error('useExperience must be used inside <Experience>');
  return ctx;
}

const COVER_IN = 1000;
const COVER_HOLD = 1500;
const COVER_OUT = 1100;

export default function Experience({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const timers = useRef<number[]>([]);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cover, setCover] = useState<CoverState>({ title: 'Κάρλα', num: 'Κανάλια Μαγνησίας', phase: 'hold' });
  const [textSize, setTextSize] = useState<TextSize>('m');
  const [contrast, setContrast] = useState(false);
  const [motionOff, setMotionOff] = useState(false);

  const getLenis = useCallback(() => lenisRef.current, []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  // Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (motionOff || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, [motionOff]);

  // Intro: the cover is visible on first paint, then lifts.
  useEffect(() => {
    if (prefersStill()) { setCover(null); setIntroDone(true); return; }
    lenisRef.current?.stop();
    later(() => { setCover((c) => (c ? { ...c, phase: 'out' } : c)); setIntroDone(true); lenisRef.current?.start(); }, COVER_HOLD);
    later(() => setCover(null), COVER_HOLD + COVER_OUT);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  // Accessibility switches live on <html> so CSS and scripts can read them.
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.text = textSize;
    if (contrast) el.dataset.contrast = 'high'; else delete el.dataset.contrast;
    if (motionOff) el.dataset.motion = 'off'; else delete el.dataset.motion;
    try { localStorage.setItem('karla-a11y', JSON.stringify({ textSize, contrast, motionOff })); } catch { /* storage may be blocked */ }
    ScrollTrigger.refresh();
  }, [textSize, contrast, motionOff]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('karla-a11y') || 'null');
      if (saved) { setTextSize(saved.textSize || 'm'); setContrast(!!saved.contrast); setMotionOff(!!saved.motionOff); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (menuOpen) lenisRef.current?.stop(); else if (!cover) lenisRef.current?.start();
  }, [menuOpen, cover]);

  const jump = useCallback((target?: string | null) => {
    if (!target) return;
    const el = document.getElementById(target);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target === 'hero' ? 0 : el, { immediate: true, force: true });
    else window.scrollTo(0, target === 'hero' ? 0 : el.getBoundingClientRect().top + window.scrollY);
    ScrollTrigger.update();
  }, []);

  const go = useCallback((title: string, target?: string | null, num = 'Μουσείο Κάρλας') => {
    if (prefersStill()) { jump(target); setMenuOpen(false); return; }
    lenisRef.current?.stop();
    setCover({ title, num, phase: 'in' });
    later(() => { jump(target); setMenuOpen(false); }, COVER_IN);
    later(() => setCover({ title, num, phase: 'out' }), COVER_HOLD);
    later(() => { setCover(null); lenisRef.current?.start(); }, COVER_HOLD + COVER_OUT);
  }, [jump]);

  const value = useMemo<Ctx>(() => ({
    settings, introDone, menuOpen,
    openMenu: () => setMenuOpen(true), closeMenu: () => setMenuOpen(false),
    go, textSize, setTextSize, contrast, setContrast, motionOff, setMotionOff,
    lenis: getLenis,
  }), [settings, introDone, menuOpen, go, textSize, contrast, motionOff, getLenis]);

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      {menuOpen && <Menu />}
      {cover && <Cover {...cover} />}
      <Cursor />
    </ExperienceContext.Provider>
  );
}
