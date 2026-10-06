import { getConfig } from './config';
import { local, readJson } from './storage';

export interface Consent {
  analytics: boolean;
  marketing: boolean;
  /** true once the visitor has made an explicit choice */
  decided: boolean;
}

const KEY = 'wti_consent_v1';
const EVENT = 'wti:consent';

/** Timezones whose visitors are treated as opt-in (EEA / UK / Switzerland). */
const isOptInRegion = (): boolean => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  return tz.startsWith('Europe/') || tz === 'Atlantic/Reykjavik' || tz === 'Atlantic/Canary';
};

/**
 * `auto`   → opt-in in Europe, notice-and-opt-out elsewhere.
 * `strict` → opt-in everywhere.
 */
const defaultConsent = (): Consent => {
  const strict = getConfig().consentMode === 'strict' || isOptInRegion();
  return strict
    ? { analytics: false, marketing: false, decided: false }
    : { analytics: true, marketing: true, decided: false };
};

export function getConsent(): Consent {
  const stored = readJson<Consent | null>(local.get(KEY), null);
  return stored ?? defaultConsent();
}

export function setConsent(next: Pick<Consent, 'analytics' | 'marketing'>): void {
  const value: Consent = { ...next, decided: true };
  local.set(KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent<Consent>(EVENT, { detail: value }));
}

export function onConsent(cb: (c: Consent) => void): void {
  window.addEventListener(EVENT, (e) => cb((e as CustomEvent<Consent>).detail));
}

/** Banner is shown until the visitor decides. */
export const needsDecision = (): boolean => !getConsent().decided;
