import { inr } from '@/lib/money';

export interface TaxiPackage {
  title: string;
  route: string;
  /** Price per vehicle in rupees (converted from the original USD fares). */
  prices: { vehicle: string; pax: string; inr: number }[];
}

export interface TaxiPage {
  slug: string;
  name: string;
  heading: string;
  metaDescription: string;
  packages: TaxiPackage[];
}

const cars = (sedan: number, innova: number, tempo: number): TaxiPackage['prices'] => [
  { vehicle: 'Sedan car', pax: '2 pax', inr: inr(sedan) },
  { vehicle: 'Toyota Innova', pax: '3 to 4 pax', inr: inr(innova) },
  { vehicle: 'Tempo Traveller', pax: '5 to 8 pax', inr: inr(tempo) },
];

export const taxiPromise =
  'We provide good quality cars of all types in India. Our drivers speak good English and other local languages. We carry medical kits in all our cars and follow all safety norms as per European standards.';

export const taxiPages: TaxiPage[] = [
  {
    slug: 'golden-triangle-tour',
    name: 'Golden Triangle',
    heading: 'Hire a taxi for the Golden Triangle tour',
    metaDescription:
      'Hire a taxi for the Golden Triangle — Delhi, Agra and Jaipur by sedan, Innova or Tempo Traveller with an English-speaking driver. Fixed fares from ₹11,050.',
    packages: [
      { title: '2 Days Delhi and Agra Tour by Car', route: 'Delhi – Agra (1) – Delhi', prices: cars(130, 190, 280) },
      { title: '3 Days Golden Triangle by Car', route: 'Delhi – Agra (1) – Jaipur (1) – Delhi', prices: cars(250, 300, 540) },
      { title: '4 Days Golden Triangle by Car', route: 'Delhi (1) – Agra (1) – Jaipur (1) – Delhi', prices: cars(300, 360, 565) },
    ],
  },
  {
    slug: 'rajasthan-tour',
    name: 'Rajasthan',
    heading: 'Hire a taxi for a Rajasthan tour',
    metaDescription:
      'Hire a taxi for Rajasthan — Jaipur, Jodhpur, Udaipur and Jaisalmer with an English-speaking driver. Fixed fares for 6 and 11 day circuits.',
    packages: [
      { title: '6 Days Rajasthan Tour by Car', route: 'Jaipur (2) – Jodhpur (1) – Udaipur (2)', prices: cars(550, 625, 720) },
      {
        title: '11 Days Rajasthan Tour by Car',
        route: 'Delhi (1) – Agra (1) – Jaipur (2) – Bikaner (1) – Jaisalmer (2) – Jodhpur (1) – Udaipur (2) – Delhi',
        prices: cars(890, 1090, 1350),
      },
    ],
  },
];

export const taxiUrl = (slug: string) => `/hire-a-taxi/${slug}/`;
