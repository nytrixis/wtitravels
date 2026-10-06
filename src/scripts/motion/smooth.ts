import Lenis from 'lenis';
import { reducedMotion } from './env';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Inertial scrolling. Skipped for reduced-motion users and touch (native momentum is better there). */
export function initSmoothScroll(): void {
  if (reducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, anchors: { offset: -88 } });
  window.__lenis = lenis;
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

/** Pause/resume smooth scrolling while an overlay owns the screen. */
export const lockScroll = (locked: boolean): void => {
  if (locked) window.__lenis?.stop();
  else window.__lenis?.start();
};
