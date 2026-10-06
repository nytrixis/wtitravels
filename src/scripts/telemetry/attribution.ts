import { local, readJson, session } from './storage';

/** Marketing parameters worth keeping with every lead. */
const PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
] as const;

export type Attribution = Record<string, string>;

const FIRST = 'wti_first_touch';
const LAST = 'wti_last_touch';
const VISITS = 'wti_visits';

const fromUrl = (): Attribution => {
  const search = new URLSearchParams(location.search);
  const out: Attribution = {};
  for (const key of PARAMS) {
    const value = search.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
};

const externalReferrer = (): string => {
  if (!document.referrer) return '';
  try {
    const ref = new URL(document.referrer);
    return ref.hostname === location.hostname ? '' : ref.hostname;
  } catch {
    return '';
  }
};

/** Call once per page load. First touch is stored for good; last touch per session. */
export function captureAttribution(): void {
  const params = fromUrl();
  const referrer = externalReferrer();
  const hasSignal = Object.keys(params).length > 0 || referrer;

  const touch: Attribution = {
    ...params,
    ...(referrer ? { referrer } : {}),
    landing_page: location.pathname,
    captured_at: new Date().toISOString(),
  };

  if (!local.get(FIRST)) local.set(FIRST, JSON.stringify(touch));
  if (hasSignal || !session.get(LAST)) session.set(LAST, JSON.stringify(touch));

  const visits = Number(local.get(VISITS) ?? '0') + (session.get('wti_counted') ? 0 : 1);
  local.set(VISITS, String(visits));
  session.set('wti_counted', '1');
}

/** Flat object prefixed for CRM-friendly lead payloads. */
export function getAttribution(): Attribution {
  const first = readJson<Attribution>(local.get(FIRST), {});
  const last = readJson<Attribution>(session.get(LAST), {});
  const flat: Attribution = {};
  for (const [k, v] of Object.entries(first)) flat[`first_${k}`] = v;
  for (const [k, v] of Object.entries(last)) flat[`last_${k}`] = v;
  flat.visit_count = local.get(VISITS) ?? '1';
  return flat;
}
