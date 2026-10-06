/// <reference types="astro/client" />

interface Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
  _fbq?: unknown;
  clarity?: (...args: unknown[]) => void;
}

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_PHONE_ALT?: string;
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_EMAIL_ALT?: string;
  readonly PUBLIC_WHATSAPP?: string;
  readonly PUBLIC_ADDRESS?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
  readonly PUBLIC_CLARITY_ID?: string;
  readonly PUBLIC_GADS_ID?: string;
  readonly PUBLIC_GADS_LEAD_LABEL?: string;
  readonly PUBLIC_TELEMETRY_ENDPOINT?: string;
  readonly PUBLIC_GSC_VERIFICATION?: string;
  readonly PUBLIC_BING_VERIFICATION?: string;
  readonly PUBLIC_CONSENT_MODE?: string;
  readonly PUBLIC_SOCIAL_FACEBOOK?: string;
  readonly PUBLIC_SOCIAL_INSTAGRAM?: string;
  readonly PUBLIC_SOCIAL_TWITTER?: string;
  readonly PUBLIC_SOCIAL_TRIPADVISOR?: string;
}
