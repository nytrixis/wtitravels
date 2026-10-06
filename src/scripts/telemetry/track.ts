import { getConfig, isDev } from './config';

export type EventParams = Record<string, string | number | boolean | undefined>;

/** Our event names → Meta Pixel standard events. */
const META_MAP: Record<string, string> = {
  generate_lead: 'Lead',
  view_tour: 'ViewContent',
  click_call: 'Contact',
  click_whatsapp: 'Contact',
  click_email: 'Contact',
  form_start: 'InitiateCheckout',
};

const clean = (params: EventParams): Record<string, string | number | boolean> =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<
    string,
    string | number | boolean
  >;

/**
 * The one entry point for all telemetry. Fans out to whichever sinks are
 * configured (dataLayer/GTM, GA4, Meta Pixel, Clarity, first-party endpoint).
 * Sinks that aren't loaded (no consent / no ID) are silent no-ops.
 */
export function track(event: string, params: EventParams = {}): void {
  const payload = {
    ...clean(params),
    page_path: location.pathname,
    page_title: document.title,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });

  window.gtag?.('event', event, payload);

  const metaEvent = META_MAP[event];
  if (metaEvent) window.fbq?.('track', metaEvent, clean(params));

  window.clarity?.('event', event);

  const { endpoint } = getConfig().tracking ?? {};
  if (endpoint && navigator.sendBeacon) {
    const body = JSON.stringify({ event, ...payload, ts: Date.now() });
    navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
  }

  if (isDev) console.debug('[track]', event, payload);
}
