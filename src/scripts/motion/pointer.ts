import { finePointer, reducedMotion } from './env';

/** Gives every .btn a --x/--y so its hover fill grows from where the pointer entered. */
function initButtonFill(): void {
  document.addEventListener(
    'pointerover',
    (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('.btn');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - r.left}px`);
      btn.style.setProperty('--y', `${e.clientY - r.top}px`);
    },
    { passive: true },
  );
}

/** [data-magnetic] elements lean toward the pointer. */
function initMagnetic(): void {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/**
 * A soft orange disc that follows the pointer only over [data-cursor] regions
 * (tour cards, destinations), labelled by the attribute value.
 */
function initCursor(): void {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  cursor.append(label);
  document.body.append(cursor);

  let x = 0,
    y = 0,
    tx = 0,
    ty = 0,
    raf = 0;
  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
  };

  document.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
      const host = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
      if (host) {
        label.textContent = host.dataset.cursor ?? '';
        cursor.classList.add('is-on');
      } else {
        cursor.classList.remove('is-on');
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
}

export function initPointer(): void {
  initButtonFill();
  if (reducedMotion()) return;
  initMagnetic();
  if (finePointer()) initCursor();
}
