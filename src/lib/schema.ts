import type { ImageMetadata } from 'astro';
import { site } from '@/config/site';
import { destinations } from '@/data/destinations';
import type { Tour } from '@/lib/tours';

type Json = Record<string, unknown>;

export const abs = (path: string): string => (/^https?:\/\//.test(path) ? path : `${site.url}${path}`);

const orgId = `${site.url}/#organization`;
const siteId = `${site.url}/#website`;

export const organizationSchema = (logoUrl?: string): Json => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': orgId,
  name: site.name,
  url: site.url,
  description: site.description,
  ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
  telephone: site.contact.phone,
  email: site.contact.email,
  address: { '@type': 'PostalAddress', addressLocality: 'New Delhi', addressCountry: 'IN' },
  areaServed: destinations.map((d) => ({ '@type': 'Country', name: d.name })),
  knowsAbout: ['India tours', 'Golden Triangle tours', 'Rajasthan tours', 'Kerala tours', 'Nepal tours', 'Bhutan tours', 'Sri Lanka tours'],
  sameAs: Object.values(site.social).filter(Boolean),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.contact.phone,
      email: site.contact.email,
      availableLanguage: ['English', 'Hindi'],
    },
  ],
});

export const websiteSchema = (): Json => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': siteId,
  url: site.url,
  name: site.name,
  publisher: { '@id': orgId },
  inLanguage: 'en',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/tours/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbSchema = (items: { name: string; href: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.href),
  })),
});

export const faqSchema = (faqs: readonly { q: string; a: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const tourSchema = (tour: Tour, url: string, imageUrl: string): Json => ({
  '@context': 'https://schema.org',
  '@type': ['TouristTrip', 'Product'],
  name: tour.title,
  description: tour.metaDescription || tour.summary,
  url,
  image: imageUrl,
  brand: { '@id': orgId },
  provider: { '@id': orgId },
  touristType: tour.holidayTypes.slice(0, 4),
  itinerary: {
    '@type': 'ItemList',
    itemListElement: tour.itinerary.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${step.label}: ${step.title}`,
      description: step.paragraphs[0]?.slice(0, 280),
    })),
  },
  ...(tour.price
    ? {
        offers: {
          '@type': 'Offer',
          price: tour.price.from,
          priceCurrency: tour.price.currency,
          availability: 'https://schema.org/InStock',
          url,
          seller: { '@id': orgId },
        },
      }
    : {}),
});

export const itemListSchema = (name: string, items: { name: string; href: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: abs(item.href),
    name: item.name,
  })),
});

export const articleSchema = (post: {
  title: string;
  description: string;
  url: string;
  image: string;
  published: Date;
  updated?: Date;
}): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  image: post.image,
  datePublished: post.published.toISOString(),
  dateModified: (post.updated ?? post.published).toISOString(),
  mainEntityOfPage: post.url,
  author: { '@id': orgId },
  publisher: { '@id': orgId },
});

export type { ImageMetadata };
