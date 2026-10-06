import { reducedMotion } from './env';

/**
 * One observer drives every entrance: [data-reveal], [data-split] and .reveal-img.
 * .reveal-img elements are clipped to nothing until revealed, and browsers don't report a
 * fully clipped element as intersecting — so they are triggered by their parent instead.
 */
export function initReveal(): void {
  const direct = [...document.querySelectorAll<HTMLElement>('[data-reveal], [data-split]')];
  const curtains = [...document.querySelectorAll<HTMLElement>('.reveal-img')];
  if (!direct.length && !curtains.length) return;

  if (reducedMotion() || !('IntersectionObserver' in window)) {
    [...direct, ...curtains].forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const groups = new Map<Element, HTMLElement[]>();
  curtains.forEach((el) => {
    const parent = el.parentElement as Element;
    groups.set(parent, [...(groups.get(parent) ?? []), el]);
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        e.target.classList.add('is-visible');
        groups.get(e.target)?.forEach((c) => c.classList.add('is-visible'));
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  direct.forEach((el) => io.observe(el));
  groups.forEach((_, parent) => io.observe(parent));
}
