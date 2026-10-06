/**
 * Real customer reviews only. The Reviews section on the home page (and the
 * AggregateRating schema) renders ONLY when this list has entries — so nothing
 * is shown until genuine testimonials are added.
 */
export interface Review {
  name: string;
  country: string;
  tour: string;
  quote: string;
  /** 1–5 */
  rating: number;
  /** ISO date */
  date: string;
}

export const reviews: Review[] = [];
