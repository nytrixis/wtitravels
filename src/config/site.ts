/**
 * Single source of truth for brand, contact and integration settings.
 * Everything is plain constants — edit here, rebuild, done. No environment variables.
 */
const digits = (value: string): string => value.replace(/\D/g, '');

/** tel: link for Indian numbers written with or without the +91 / leading 0. */
export const telHref = (number: string): string => {
  const d = digits(number);
  if (number.trim().startsWith('+')) return `tel:+${d}`;
  return `tel:+91${d.replace(/^0/, '')}`;
};

const phone = '+91 87663 73398';

export const site = {
  name: 'WTI Tours & Travels',
  shortName: 'WTI Travels',
  tagline: 'Tailor-made journeys across India & the Himalaya',
  description:
    'Private and group tours across India, Nepal, Bhutan and Sri Lanka — tailor-made itineraries, hand-picked hotels and a friendly tour manager on call 24x7. Get your proposal within 24 hours.',
  /** Live domain — used for canonicals, sitemap, social cards. */
  url: 'https://www.wtitravels.com',
  locale: 'en',
  /** Used for Organization/LocalBusiness schema. */
  foundingLocation: 'New Delhi, India',

  contact: {
    phone,
    phoneHref: telHref(phone),
    phoneAlt: '011-4505 4254',
    person: 'RP Mishra',
    personPhone: '+91 95403 51000',
    email: 'sales@wtitravels.com',
    emailAlt: '',
    /** International format, digits only. */
    whatsapp: '918766373398',
    address: 'L-317/73, Mahipalpur, NH-8, New Delhi – 110037',
    hours: 'Mon–Sat, 9:00–19:00 IST · Tour managers on call 24x7',
  },

  /** Leave a URL empty to hide the icon. */
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    tripadvisor: '',
  },

  /**
   * Lead delivery. Any JSON-accepting endpoint works — Web3Forms
   * ("https://api.web3forms.com/submit" + accessKey) or Formspree ("https://formspree.io/f/xxxx").
   * While empty, a submit hands the lead to WhatsApp so it isn't lost.
   */
  forms: {
    endpoint: '',
    accessKey: '',
  },

  /** Third-party tags — each loads only after cookie consent. Empty = off. */
  tracking: {
    ga4: '',
    gtm: '',
    metaPixel: '',
    clarity: '',
    googleAds: '',
    googleAdsLeadLabel: '',
    /** Optional first-party event sink (receives sendBeacon JSON). */
    endpoint: '',
  },

  /** 'auto' = opt-in for Europe/UK timezones, notice + opt-out elsewhere; 'strict' = opt-in everywhere. */
  consentMode: 'auto' as 'auto' | 'strict',

  verification: {
    google: '',
    bing: '',
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
