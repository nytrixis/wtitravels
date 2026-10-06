import { initCounters } from './counters';
import { initHeader } from './header';
import { initPointer } from './pointer';
import { initReveal } from './reveal';
import { initSmoothScroll } from './smooth';
import { initSplit } from './split';
import { reducedMotion } from './env';

export function initMotion(): void {
  document.documentElement.classList.toggle('motion', !reducedMotion());
  initSplit();
  initReveal();
  initCounters();
  initPointer();
  initHeader();
  initSmoothScroll();
}
export { lockScroll } from './smooth';
