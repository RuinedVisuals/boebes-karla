'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersStill } from '@/lib/gsap';

type Options = {
  count: number;
  /** Pixels of drag that move one item. */
  span: number;
  /** Called every frame with the smoothed position (0..count-1, fractional). */
  onFrame: (pos: number, dragging: boolean) => void;
  start?: number;
};

/**
 * Drag + throw + snap for carousels. Smooth because the target moves with the pointer and
 * the rendered position eases toward it every tick; snapping happens only on release.
 */
export function useDragInertia(el: React.RefObject<HTMLElement | null>, { count, span, onFrame, start = 0 }: Options) {
  const state = useRef({ pos: start, target: start, vel: 0, down: false, lastX: 0, moved: 0 });
  const api = useRef({
    goTo: (i: number) => { state.current.target = Math.max(0, Math.min(count - 1, i)); },
    get index() { return Math.round(state.current.target); },
    get moved() { return state.current.moved; },
  });

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const st = state.current;
    const down = (e: PointerEvent) => { if (e.button !== 0) return; st.down = true; st.lastX = e.clientX; st.moved = 0; st.vel = 0; };
    const move = (e: PointerEvent) => {
      if (!st.down) return;
      const dx = e.clientX - st.lastX; st.lastX = e.clientX; st.moved += Math.abs(dx);
      st.target -= dx / span;
      st.vel = st.vel * 0.6 + (-dx / span) * 0.4;
    };
    const up = () => {
      if (!st.down) return;
      st.down = false;
      st.target = Math.max(0, Math.min(count - 1, Math.round(st.target + st.vel * 6)));
    };
    node.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    const tick = () => {
      if (!st.down) st.target = Math.max(-0.3, Math.min(count - 0.7, st.target));
      st.pos += (st.target - st.pos) * (prefersStill() ? 1 : st.down ? 0.25 : 0.1);
      onFrame(st.pos, st.down);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      node.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [el, count, span, onFrame]);

  return api.current;
}
