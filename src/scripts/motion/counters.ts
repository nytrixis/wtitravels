import { reducedMotion } from './env';

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

/** <span data-count-to="15000" data-count-suffix="+"> counts up the first time it is seen. */
export function initCounters(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-count-to]');
  if (!els.length) return;

  const format = (el: HTMLElement, n: number) =>
    `${el.dataset.countPrefix ?? ''}${Math.round(n).toLocaleString('en-IN')}${el.dataset.countSuffix ?? ''}`;

  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.countTo);
    if (reducedMotion()) return void (el.textContent = format(el, to));
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = format(el, to * ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}
