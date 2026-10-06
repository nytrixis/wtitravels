/** Header glides away while reading down and returns on the first upward scroll. */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  let last = scrollY;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const delta = y - last;
    const menuOpen = document.querySelector('[data-drawer]:not([hidden])');
    // Hide only on a clear downward move, show on any real upward move. Never
    // un-hide just because smooth-scroll inertia slowed down.
    if (y < 120 || delta < -4) header.classList.remove('is-hidden');
    else if (delta > 4 && y > 320 && !menuOpen) header.classList.add('is-hidden');
    last = y;
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  // Keyboard users tabbing into the header must always see it.
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  update();
}
