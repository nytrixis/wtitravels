/**
 * Splits [data-split] headings into masked words so they can slide up one by one.
 * Walks text nodes only, so inline markup (<em>, <br>) survives.
 */
export function initSplit(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    if (el.classList.contains('is-split')) return;
    let index = 0;

    const walk = (node: Node): void => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = (child.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              frag.append(' ');
              continue;
            }
            const outer = document.createElement('span');
            outer.className = 'w';
            const inner = document.createElement('span');
            inner.textContent = part;
            inner.style.setProperty('--i', String(index++));
            outer.append(inner);
            frag.append(outer);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
          walk(child);
        }
      });
    };

    el.setAttribute('aria-label', el.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    walk(el);
    el.querySelectorAll('.w').forEach((w) => w.setAttribute('aria-hidden', 'true'));
    el.classList.add('is-split');
  });
}
