/// <reference types="astro/client" />

interface Window {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
  _fbq?: unknown;
  clarity?: (...args: unknown[]) => void;
}

