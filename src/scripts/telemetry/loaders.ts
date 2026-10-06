import { getConfig } from './config';
import { getConsent, onConsent, type Consent } from './consent';

const injected = new Set<string>();

function addScript(id: string, src: string, onload?: () => void): void {
  if (injected.has(id)) return;
  injected.add(id);
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  if (onload) s.onload = onload;
  document.head.appendChild(s);
}

function loadGoogle(): void {
  const { ga4, googleAds, gtm } = getConfig().tracking;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

  const consent = getConsent();
  const state = (granted: boolean) => (granted ? 'granted' : 'denied');
  window.gtag('consent', 'default', {
    analytics_storage: state(consent.analytics),
    ad_storage: state(consent.marketing),
    ad_user_data: state(consent.marketing),
    ad_personalization: state(consent.marketing),
  });

  if (gtm) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    addScript('gtm', `https://www.googletagmanager.com/gtm.js?id=${gtm}`);
  }
  const primary = ga4 || googleAds;
  if (primary) {
    addScript('gtag', `https://www.googletagmanager.com/gtag/js?id=${primary}`, () => {
      window.gtag?.('js', new Date());
      if (ga4) window.gtag?.('config', ga4, { send_page_view: true });
      if (googleAds) window.gtag?.('config', googleAds);
    });
  }
}

function loadMeta(): void {
  const { metaPixel } = getConfig().tracking;
  if (!metaPixel || window.fbq) return;
  const fbq = function (...args: unknown[]) {
    (fbq.queue = fbq.queue || []).push(args);
  } as NonNullable<Window['fbq']>;
  fbq.loaded = true;
  window.fbq = fbq;
  addScript('fbevents', 'https://connect.facebook.net/en_US/fbevents.js', () => {
    window.fbq?.('init', metaPixel);
    window.fbq?.('track', 'PageView');
  });
}

function loadClarity(): void {
  const { clarity } = getConfig().tracking;
  if (!clarity || window.clarity) return;
  window.clarity = function (...args: unknown[]) {
    ((window.clarity as unknown as { q?: unknown[] }).q ??= []).push(args);
  };
  addScript('clarity', `https://www.clarity.ms/tag/${clarity}`);
}

function apply(consent: Consent): void {
  if (consent.analytics) {
    loadGoogle();
    loadClarity();
  }
  if (consent.marketing) loadMeta();
  // Keep Google's consent state in sync for tags already on the page.
  window.gtag?.('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  });
}

/** Loads third-party tags according to consent, now and on any later change. */
export function initLoaders(): void {
  apply(getConsent());
  onConsent(apply);
}
