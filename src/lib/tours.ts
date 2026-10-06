import type { ImageMetadata } from 'astro';
import raw from '@/data/tours.json';

export type RegionId = 'india' | 'nepal' | 'bhutan' | 'sri-lanka';

export interface ItineraryStep {
  label: string;
  title: string;
  paragraphs: string[];
}

export interface Tour {
  slug: string;
  title: string;
  regions: RegionId[];
  durationDays: number | null;
  durationLabel: string;
  summary: string;
  metaDescription: string;
  intro: string[];
  overview: string[];
  itinerary: ItineraryStep[];
  cover: string;
  gallery: string[];
  categories: string[];
  holidayTypes: string[];
  themes: string[];
  activityLevel: string;
  activityScore: string;
  groupSize: string | null;
  price: { from: number; was?: number; currency: string; unit: string } | null;
  inclusions: string[];
  exclusions: string[];
  hotelNote: string[];
}

export const tours = raw as Tour[];

const bySlug = new Map(tours.map((t) => [t.slug, t]));
export const getTour = (slug: string): Tour => {
  const tour = bySlug.get(slug);
  if (!tour) throw new Error(`Unknown tour slug: ${slug}`);
  return tour;
};

/* ───────── Images ───────── */
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/tours/*.{jpg,jpeg,png}', {
  eager: true,
});
const imageByName = new Map(
  Object.entries(images).map(([path, mod]) => [path.split('/').pop() as string, mod.default]),
);

export const tourImage = (name: string): ImageMetadata => {
  const img = imageByName.get(name);
  if (!img) throw new Error(`Missing tour image: ${name}`);
  return img;
};

export const coverOf = (tour: Tour): ImageMetadata => tourImage(tour.cover);

/* ───────── Taxonomy ───────── */
export const regionLabels: Record<RegionId, string> = {
  india: 'India',
  nepal: 'Nepal',
  bhutan: 'Bhutan',
  'sri-lanka': 'Sri Lanka',
};

export const styleLabels: Record<string, string> = {
  luxury: 'Luxury',
  budget: 'Budget',
  group: 'Group',
  short: 'Short break',
  honeymoon: 'Honeymoon',
  heritage: 'Heritage',
  culture: 'Culture',
  temples: 'Temples',
  wildlife: 'Wildlife',
  beach: 'Beach',
  wellness: 'Wellness',
  food: 'Food',
};

/** Duration buckets used by the filter UI. */
export const durationBuckets = [
  { id: 'short', label: 'Up to 4 days', test: (d: number) => d <= 4 },
  { id: 'week', label: '5–8 days', test: (d: number) => d >= 5 && d <= 8 },
  { id: 'long', label: '9+ days', test: (d: number) => d >= 9 },
] as const;

export const bucketOf = (tour: Tour): string => {
  const days = tour.durationDays ?? 1;
  return durationBuckets.find((b) => b.test(days))?.id ?? 'week';
};

export const nightsOf = (tour: Tour): number | null =>
  tour.durationDays && tour.durationDays > 1 ? tour.durationDays - 1 : null;

export const primaryRegion = (tour: Tour): RegionId => tour.regions[tour.regions.length - 1];

export const routeOf = (tour: Tour): string =>
  tour.regions.map((r) => regionLabels[r]).join(' + ');

export const tourUrl = (slug: string): string => `/tours/${slug}/`;

/** Curated sets that mirror the original homepage sections. */
export const popularSlugs = [
  'day-trip-to-agra',
  'mesmerising-rajasthan-tour',
  'luxury-golden-triangle-tour-with-oberoi-hotels',
  'classical-north-india-tour',
  'golden-triangle-with-kerala-tours',
  'luxury-golden-triangle-tour-with-taj-hotels',
  'golden-triangle-with-haridwar-rishikesh',
  'majestic-south-india-tour',
] as const;

export const favouriteSlugs = [
  'luxury-train-tour-in-india',
  'golden-triangle-tour-with-holi-celebration',
  'bangalore-mysore-ooty-tour',
  'shopping-tour-with-taj-mahal',
  'luxury-golden-triangle-group-tour',
  'magnificent-shimla-manali-tour',
  'ultimate-south-india-tour',
  '3-days-golden-triangle-tour',
] as const;

export const pick = (slugs: readonly string[]): Tour[] => slugs.map(getTour);

/** Related = same primary category, closest in duration, never itself. */
export const relatedTours = (tour: Tour, limit = 3): Tour[] =>
  tours
    .filter((t) => t.slug !== tour.slug)
    .map((t) => {
      const sharedCats = t.categories.filter((c) => tour.categories.includes(c)).length;
      const sharedRegion = t.regions.some((r) => tour.regions.includes(r)) ? 2 : 0;
      const distance = Math.abs((t.durationDays ?? 1) - (tour.durationDays ?? 1));
      return { t, score: sharedCats * 2 + sharedRegion - distance * 0.4 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ t }) => t);
