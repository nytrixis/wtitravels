import { tours, type Tour } from '@/lib/tours';

export type CollectionKind = 'style' | 'package';

export interface Collection {
  slug: string;
  kind: CollectionKind;
  title: string;
  /** Short label for chips and nav. */
  label: string;
  heading: string;
  /** SEO meta description. */
  metaDescription: string;
  intro: string[];
  /** Hero photo key in /src/assets/hero (without extension) — falls back to the first tour cover. */
  match: (tour: Tour) => boolean;
}

const hasCat = (...cats: string[]) => (t: Tour) => cats.some((c) => t.categories.includes(c));
const hasTheme = (theme: string) => (t: Tour) => t.themes.includes(theme);

/** Tour styles — mirrors the original "Tours" menu. */
const styles: Collection[] = [
  {
    slug: 'luxury-tours',
    kind: 'style',
    title: 'Luxury Tours in India',
    label: 'Luxury',
    heading: 'Luxury tours of India',
    metaDescription:
      'Luxury India tours with Oberoi, Taj and ITC hotels, heritage palaces and the Maharajas’ Express. Tailor-made by WTI Tours & Travels — proposal in 24 hours.',
    intro: [
      'India is one of the best holiday destinations for luxury tours because of its different traditions and cultures brought together into one colourful expression. India luxury tour packages offer a very unique and luxurious way to visit most of the famous places like Rajasthan — known as the “Land of Kings” or “Land of Maharajas” — including the Taj Mahal in Agra.',
      'We have luxury resorts and palaces, heritage palaces and mansions to experience the top level of hospitality, such as Oberoi Hotels, Taj Hotels, ITC Hotels and others. India Luxury Train tours are a very unique and luxurious way to visit our Incredible Country India.',
    ],
    match: hasTheme('luxury'),
  },
  {
    slug: 'budget-tours',
    kind: 'style',
    title: 'Budget Tours in India',
    label: 'Budget',
    heading: 'Budget tours of India',
    metaDescription:
      'Affordable India tours without cutting corners — budget heritage and boutique hotels, home stays, private transfers and guides. Get a free quote from WTI Tours & Travels.',
    intro: [
      'Exploring a destination doesn’t always mean spending big bucks — you can experience what it has to offer on a shoestring budget. However, low prices by no means translate into lowered service standards. We have tied up with budget heritage and boutique hotels, and home stays, to offer you a unique experiential living.',
      'Our budget tour packages in India are among the most affordable for anyone planning a trip to India. The vibrant nation is huge with holiday destinations abound, so to make the most of your vacation one needs to plan accordingly. There is nothing better than exploring the must-visit places in India like Delhi, Agra, Jaipur, Rajasthan, Kerala, Shimla, Manali and South India without burning a hole in the pocket.',
      'Budget holidays in India are not just affordable, they also promise memories of a lifetime. Right from the accommodation, pick-up and drop services, food to excursions, everything is taken care of.',
    ],
    match: hasTheme('budget'),
  },
  {
    slug: 'group-tours',
    kind: 'style',
    title: 'Group Tours in India',
    label: 'Group',
    heading: 'Group tours of India',
    metaDescription:
      'Small-group and private-group tours across India — Golden Triangle, Rajasthan, Kerala and South India. Itineraries by WTI Tours & Travels.',
    intro: [
      'Considered among the most popular types of travel, group tours have gained a lot of fame not just in India but across the world. Group tours can involve people who know each other or are related in some way, or people who are complete strangers. It is a great travel option for solo travel enthusiasts who have a well-planned itinerary and a group to travel with.',
      'Group tours to India welcome you to dig deeper into a land rich in cultures, heritages and passions. Indulge in the diversity of India with fabulous tours that take in Mumbai; the Golden Triangle of Delhi, Agra and Jaipur in the north; Udaipur, Jodhpur, Jaisalmer and Bikaner in Rajasthan; and Cochin, Kerala, Thekkady and Madurai in the south.',
      'Check our itineraries and choose one of our listed group tours in India that suits your needs. WTI Tours & Travels will make your trip a memorable one.',
    ],
    match: hasTheme('group'),
  },
  {
    slug: 'short-tours',
    kind: 'style',
    title: 'Short Tours in India',
    label: 'Short breaks',
    heading: 'Short tours of India',
    metaDescription:
      '2 to 5 day short tours in India — Golden Triangle, Agra day trips, Shimla, Mysore and more. Quick, smart getaways by WTI Tours & Travels.',
    intro: [
      'If you are planning a short vacation in India then we are here for you. We offer amazing 2 to 5 day short tours across India. A short getaway makes for a perfect, smart holiday — from the best beaches to snow-clad mountains, caves and forts, find your choice of destination and make the most memorable short India tour of your life.',
      'Short tour packages let you explore the major attractions of different Indian regions like Delhi, Agra, Jaipur, Rajasthan, Kerala, Shimla, Manali, hill stations, South India, Goa and Mumbai. Short trips to these enchanting destinations will help you discover hidden treasures. You can also get the itineraries customised according to your requirements.',
    ],
    match: hasTheme('short'),
  },
];

/** Holiday packages — mirrors the original "Holidays Packages" menu. */
const packages: Collection[] = [
  {
    slug: 'golden-triangle-tours',
    kind: 'package',
    title: 'Golden Triangle Tours',
    label: 'Golden Triangle',
    heading: 'Golden Triangle tours',
    metaDescription:
      'Golden Triangle tours of Delhi, Agra and Jaipur — 3, 4, 5 and 6 day private and luxury itineraries, plus extensions to Kerala, Nepal, Kashmir and Goa.',
    intro: [
      'The Golden Triangle is India’s classic first journey: Delhi for its Mughal and British grandeur, Agra for the Taj Mahal, and Jaipur — the Pink City — for its forts and palaces. These tours include some of the finest monuments and UNESCO World Heritage Sites in the country.',
    ],
    match: hasCat('golden-triangle-tours'),
  },
  {
    slug: 'rajasthan-tours',
    kind: 'package',
    title: 'Rajasthan Tours',
    label: 'Rajasthan',
    heading: 'Rajasthan tours',
    metaDescription:
      'Rajasthan tour packages through Jaipur, Jodhpur, Udaipur and Jaisalmer — forts, palaces, desert camps and heritage hotels. Tailor-made by WTI Tours & Travels.',
    intro: [
      'Rajasthan is known as the “Land of Kings” or “Land of Maharajas”. The glory of the state is retained by its majestic palaces, forts and monuments, built in different eras throughout history. The vibrant culture and rich heritage of this princely state draw innumerable tourists from across the globe.',
    ],
    match: hasCat('rajasthan-tours'),
  },
  {
    slug: 'fort-and-palaces-of-rajasthan-tours',
    kind: 'package',
    title: 'Forts & Palaces of Rajasthan Tours',
    label: 'Forts & Palaces',
    heading: 'Forts and palaces of Rajasthan',
    metaDescription:
      'Tours built around the real forts and palaces of Rajasthan — Amber, Mehrangarh, Jaisalmer, City Palace and more.',
    intro: [
      'India has a vast and rich cultural history, and many forts and palaces adorn this beautiful country. These tours are prepared for travelers who wish to see the real forts and palaces of India.',
    ],
    match: hasCat('fort-and-palaces-of-rajasthan-tours'),
  },
  {
    slug: 'kerala-tours',
    kind: 'package',
    title: 'Kerala Tours',
    label: 'Kerala',
    heading: 'Kerala tours — God’s Own Country',
    metaDescription:
      'Kerala tour packages — backwater houseboats, tea hills, Ayurveda and Kathakali — alone or combined with the Golden Triangle.',
    intro: [
      'Discover the beautiful backwaters, stunning nature and rich cultural heritage of the southern states of India. Kerala trip packages also bring you close to tea plantations, wildlife and the warmth of Kerala’s hospitality.',
    ],
    match: hasCat('kerala-tours'),
  },
  {
    slug: 'south-india-tours',
    kind: 'package',
    title: 'South India Tours',
    label: 'South India',
    heading: 'South India tours',
    metaDescription:
      'South India tours covering Bangalore, Mysore, Ooty, Madurai, Mahabalipuram, Kanyakumari and Kerala — temples, palaces and tea hills.',
    intro: [
      'South India tours let you explore the culture, heritage, architecture and ultimate temples of the south — a very different India from the north, with its own cuisine, language and traditions.',
    ],
    match: hasCat('south-india-tours'),
  },
  {
    slug: 'heritage-and-cultural',
    kind: 'package',
    title: 'Heritage & Cultural Tours',
    label: 'Heritage & Cultural',
    heading: 'Heritage and cultural tours',
    metaDescription:
      'Heritage and cultural tours of India — palaces, temples, UNESCO sites and living traditions — designed by WTI Tours & Travels.',
    intro: [
      'India is the land of diversity: myriad cultures, exotic palaces, busy streets, holy rivers and lakes, century-old temples, mosques and churches, bewitching beaches, enormous valleys, the mighty Himalaya, dense forest reserves and bird sanctuaries, divergent languages, festivals, arts and crafts, culinary habits, Ayurveda and rich heritage.',
      'We have come up with a concept of exploring and travelling India through meticulously tailored packages.',
    ],
    match: hasCat('heritage-and-cultural'),
  },
  {
    slug: 'north-india-cultural-tours',
    kind: 'package',
    title: 'North India Cultural Tours',
    label: 'North India Cultural',
    heading: 'North India cultural tours',
    metaDescription:
      'North India cultural tours — Delhi, Jaipur, Agra, Orchha, Khajuraho and Varanasi.',
    intro: [
      'Ultimate programmes that bring together the top cultural and heritage locations of North India — Delhi, Jaipur, Agra, Orchha, Khajuraho and Varanasi.',
    ],
    match: hasCat('north-india-cultural-tours'),
  },
  {
    slug: 'taj-mahal-tours',
    kind: 'package',
    title: 'Taj Mahal Tours',
    label: 'Taj Mahal',
    heading: 'Taj Mahal tours',
    metaDescription:
      'Taj Mahal tours from Delhi — same-day Agra trips, overnight Agra stays and shopping tours with a sunrise visit.',
    intro: [
      'Agra, the land of the Taj Mahal — the monument that has come to eternally symbolise love — is a city of rich historical and architectural heritage. Being only a few hours’ drive from Delhi, it is easy to visit in a day, overnight, or as part of a longer journey.',
    ],
    match: hasCat('taj-mahal-tours'),
  },
  {
    slug: 'kashmir-tours-packages',
    kind: 'package',
    title: 'Kashmir Tours Packages',
    label: 'Kashmir',
    heading: 'Kashmir tour packages',
    metaDescription: 'Kashmir tour packages — Srinagar, Dal Lake shikaras, Gulmarg, Pahalgam and Sonamarg.',
    intro: ['Shikara rides on Dal Lake, Mughal gardens, tulip fields and snow-capped meadows — Kashmir in its best season.'],
    match: hasCat('kashmir-tours-packages'),
  },
  {
    slug: 'shimla-manali-tours',
    kind: 'package',
    title: 'Shimla Manali Tours',
    label: 'Shimla Manali',
    heading: 'Shimla Manali tours',
    metaDescription: 'Shimla and Manali tour packages — hill-station escapes in Himachal Pradesh.',
    intro: [
      'For travelers who love the idea of spending vacations in hill stations, North India — especially Himachal Pradesh — has just the right place.',
    ],
    match: hasCat('shimla-manali-tours'),
  },
  {
    slug: 'beach-holidays',
    kind: 'package',
    title: 'Beach Holidays',
    label: 'Beach',
    heading: 'Beach holidays',
    metaDescription: 'Beach holidays in India and Sri Lanka — Goa, Mumbai and the Kerala coast.',
    intro: ['Add sand and sea to your cultural journey — Goa, the Konkan coast and Kerala’s shoreline.'],
    match: hasCat('beach', 'beach-holidays'),
  },
  {
    slug: 'wildlife-india-tours',
    kind: 'package',
    title: 'Wildlife India Tours',
    label: 'Wildlife',
    heading: 'Wildlife tours in India',
    metaDescription: 'Wildlife tours in India — Ranthambore tigers and Rajasthan’s national parks and bird sanctuaries.',
    intro: [
      'Rajasthan is remarkably rich in wildlife heritage: Ranthambore National Park, Desert National Park, Sariska and the Bharatpur Bird Sanctuary are among the best places for wildlife lovers and photographers.',
    ],
    match: hasCat('wildlife-india-tours'),
  },
  {
    slug: 'rural-village-tours',
    kind: 'package',
    title: 'Rural Village Tours',
    label: 'Rural Village',
    heading: 'Rural village tours',
    metaDescription: 'Rural village tours in India — craft villages, village life and local culture.',
    intro: [
      'Approximately 70% of India’s population lives in villages. If you are planning a village tour in India, we suggest the village of Sanganer, about 12 km south of Jaipur, which boasts a ruined palace, a group of Jain temples with fine carvings and two ruined tripolias (triple gateways).',
    ],
    match: hasCat('rural-village-tours'),
  },
];

export const collections: Collection[] = [...styles, ...packages];

export const getCollection = (slug: string): Collection => {
  const found = collections.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown collection: ${slug}`);
  return found;
};

export const toursIn = (collection: Collection): Tour[] => tours.filter(collection.match);

export const styleCollections = styles;
export const packageCollections = packages;
export const collectionUrl = (slug: string) => `/collections/${slug}/`;
