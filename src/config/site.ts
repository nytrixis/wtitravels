/**
 * Single source of truth for brand, contact and integration settings.
 * Everything that must change before launch is driven by environment
 * variables (see .env.example) — never edit components for these.
 */
const env = import.meta.env;

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const digits = (value: string): string => value.replace(/\D/g, '');

const phone = str(env.PUBLIC_PHONE, '+91 87663 73398');
const email = str(env.PUBLIC_EMAIL, 'sales@wtitravels.com');
const whatsapp = digits(str(env.PUBLIC_WHATSAPP, '918766373398'));

/** tel: link for Indian numbers written with or without the +91 / leading 0. */
export const telHref = (number: string): string => {
  const d = digits(number);
  if (number.trim().startsWith('+')) return `tel:+${d}`;
  return `tel:+91${d.replace(/^0/, '')}`;
};

export const site = {
  name: 'WTI Tours & Travels',
  shortName: 'WTI Travels',
  tagline: 'Tailor-made journeys across India & the Himalaya',
  description:
    'Private and group tours across India, Nepal, Bhutan and Sri Lanka — tailor-made itineraries, hand-picked hotels and a friendly tour manager on call 24x7. Get your proposal within 24 hours.',
  url: str(env.PUBLIC_SITE_URL, 'https://www.wtitravels.com').replace(/\/$/, ''),
  locale: 'en',
  /** Used for Organization/LocalBusiness schema. */
  foundingLocation: 'New Delhi, India',

  contact: {
    phone,
    phoneHref: telHref(phone),
    phoneAlt: str(env.PUBLIC_PHONE_ALT, '011-4505 4254'),
    person: str(env.PUBLIC_CONTACT_PERSON, 'RP Mishra'),
    personPhone: str(env.PUBLIC_CONTACT_PERSON_PHONE, '+91 95403 51000'),
    email,
    emailAlt: str(env.PUBLIC_EMAIL_ALT),
    whatsapp,
    address: str(env.PUBLIC_ADDRESS, 'L-317/73, Mahipalpur, NH-8, New Delhi – 110037'),
    hours: 'Mon–Sat, 9:00–19:00 IST · Tour managers on call 24x7',
  },

  /** Leave a URL empty to hide the icon. */
  social: {
    facebook: str(env.PUBLIC_SOCIAL_FACEBOOK),
    instagram: str(env.PUBLIC_SOCIAL_INSTAGRAM),
    twitter: str(env.PUBLIC_SOCIAL_TWITTER),
    tripadvisor: str(env.PUBLIC_SOCIAL_TRIPADVISOR),
  },

  forms: {
    endpoint: str(env.PUBLIC_FORM_ENDPOINT),
    accessKey: str(env.PUBLIC_FORM_ACCESS_KEY),
  },

  tracking: {
    ga4: str(env.PUBLIC_GA4_ID),
    gtm: str(env.PUBLIC_GTM_ID),
    metaPixel: str(env.PUBLIC_META_PIXEL_ID),
    clarity: str(env.PUBLIC_CLARITY_ID),
    googleAds: str(env.PUBLIC_GADS_ID),
    googleAdsLeadLabel: str(env.PUBLIC_GADS_LEAD_LABEL),
    endpoint: str(env.PUBLIC_TELEMETRY_ENDPOINT),
  },

  verification: {
    google: str(env.PUBLIC_GSC_VERIFICATION),
    bing: str(env.PUBLIC_BING_VERIFICATION),
  },

  /**
   * Marketing claims carried over from the original copy.
   * CONFIRM each of these is true for WTI before publishing.
   */
  claims: {
    happyClients: '15,000+',
    proposalHours: 24,
    hotelRange: '3★ to 5★',
    support: '24x7',
  },
} as const;

export type Site = typeof site;

export const whatsappLink = (message = ''): string =>
  `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

/** True while any launch-critical value is still a placeholder. */
export const hasPlaceholderContact = site.contact.phone.includes('00000') || site.contact.email.includes('your-domain');
