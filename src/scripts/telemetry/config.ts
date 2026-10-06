/**
 * Public runtime config, serialised into the page by BaseLayout as
 * <script type="application/json" id="wti-config">. Keeps secrets out of
 * source and lets every client module read one typed object.
 */
export interface ClientConfig {
  siteName: string;
  siteUrl: string;
  whatsapp: string;
  email: string;
  formEndpoint: string;
  formAccessKey: string;
  consentMode: 'auto' | 'strict';
  tracking: {
    ga4: string;
    gtm: string;
    metaPixel: string;
    clarity: string;
    googleAds: string;
    googleAdsLeadLabel: string;
    endpoint: string;
  };
}

let cached: ClientConfig | undefined;

export function getConfig(): ClientConfig {
  if (cached) return cached;
  const el = document.getElementById('wti-config');
  try {
    cached = JSON.parse(el?.textContent ?? '{}') as ClientConfig;
  } catch {
    cached = {} as ClientConfig;
  }
  return cached;
}

export const isDev = import.meta.env.DEV;
