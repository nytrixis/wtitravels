import { track, type EventParams } from './track';

/** Maps `data-track-*` attributes to event params: data-track-item-id → item_id. */
function paramsFrom(el: HTMLElement): EventParams {
  const out: EventParams = {};
  for (const [key, value] of Object.entries(el.dataset)) {
    if (!key.startsWith('track') || key === 'track' || key === 'trackView' || value === undefined) continue;
    const name = key
      .slice(5)
      .replace(/^[A-Z]/, (c) => c.toLowerCase())
      .replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    out[name] = value;
  }
  return out;
}

const linkEvent = (a: HTMLAnchorElement): { name: string; params: EventParams } | null => {
  const href = a.getAttribute('href') ?? '';
  const location_ = a.dataset.trackLocation ?? a.closest<HTMLElement>('[data-location]')?.dataset.location;
  if (href.startsWith('tel:')) return { name: 'click_call', params: { location: location_, number: href.slice(4) } };
  if (href.startsWith('mailto:')) return { name: 'click_email', params: { location: location_ } };
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)/.test(href)) return { name: 'click_whatsapp', params: { location: location_ } };
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return { name: 'click_outbound', params: { destination: url.hostname } };
  } catch {
    /* ignore malformed hrefs */
  }
  return null;
};

function trackClicks(): void {
  document.addEventListener(
    'click',
    (event) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-track], a[href]');
      if (!target) return;

      if (target.dataset.track) {
        track(target.dataset.track, paramsFrom(target));
        return;
      }
      if (target instanceof HTMLAnchorElement) {
        const evt = linkEvent(target);
        if (evt) track(evt.name, { ...evt.params, ...paramsFrom(target) });
      }
    },
    { capture: true },
  );
}

function trackScrollDepth(): void {
  const marks = [25, 50, 75, 90];
  const fired = new Set<number>();
  let ticking = false;
  const check = () => {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - innerHeight;
    if (scrollable < 200) return;
    const pct = (scrollY / scrollable) * 100;
    for (const m of marks) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track('scroll_depth', { percent: m });
      }
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    },
    { passive: true },
  );
}

/** Counts only time the tab is visible. */
function trackEngagement(): void {
  const marks = [15, 30, 60, 120];
  let seconds = 0;
  setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    seconds += 1;
    if (marks.includes(seconds)) track('engaged_time', { seconds });
  }, 1000);
}

/** Fires once when an element with data-track-impression is half visible. */
function trackImpressions(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-track-impression]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const key = `${el.dataset.trackImpression}:${el.dataset.trackItemId ?? ''}`;
        if (seen.has(key)) continue;
        seen.add(key);
        track(el.dataset.trackImpression as string, paramsFrom(el));
      }
    },
    { threshold: 0.5 },
  );
  els.forEach((el) => io.observe(el));
}

/** `<meta>`-style view events: any element with data-track-view fires on load. */
function trackViews(): void {
  document.querySelectorAll<HTMLElement>('[data-track-view]').forEach((el) => {
    track(el.dataset.trackView as string, paramsFrom(el));
  });
}

export function initAutoTracking(): void {
  trackClicks();
  trackScrollDepth();
  trackEngagement();
  trackImpressions();
  trackViews();
}
