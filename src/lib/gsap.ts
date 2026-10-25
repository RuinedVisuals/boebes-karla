'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const EASE_WATER = 'expo.out';

/** True when the visitor (OS setting) or the in-site switch asked for less motion. */
export function prefersStill(): boolean {
  if (typeof window === 'undefined') return false;
  if (document.documentElement.dataset.motion === 'off') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, useGSAP };
