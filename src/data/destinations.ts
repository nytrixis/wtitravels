import type { RegionId } from '@/lib/tours';

export interface Destination {
  id: RegionId;
  slug: string;
  name: string;
  /** Page <h1> */
  heading: string;
  strapline: string;
  metaDescription: string;
  /** "Top attractions" copy from the original site. */
  paragraphs: string[];
  bestSeason: string;
  popular: string[];
}

export const destinations: Destination[] = [
  {
    id: 'india',
    slug: 'india',
    name: 'India',
    heading: 'Incredible India holidays',
    strapline: 'Palaces, temples, backwaters and the Himalaya — all in one country.',
    metaDescription:
      'India tour packages — Golden Triangle, Rajasthan, Kerala, South India, Kashmir and more. Private and group tours tailor-made by WTI Tours & Travels.',
    paragraphs: [
      'India is most famous for its culture, where a myriad of cultures from all around the world come together and fall into one place. India is also famous for its unity-in-diversity pledge, for its spices, and for a cuisine that is world famous.',
      'The main reason India is famous for tourism is that it holds all types of tourist destinations in one place. India is the right place for heritage, culture, forts and palaces, Ayurveda, wild safaris, desert safaris, nature-seeking places, honeymoon spots, adventurous activities, spiritual places and historical places.',
    ],
    bestSeason: 'September to April',
    popular: ['Delhi', 'Agra', 'Jaipur', 'Rajasthan', 'Kerala', 'Mumbai', 'Goa'],
  },
  {
    id: 'nepal',
    slug: 'nepal',
    name: 'Nepal',
    heading: 'Holidays in Nepal',
    strapline: 'Eight of the ten highest peaks on earth, and temples in every valley.',
    metaDescription:
      'Nepal tours combined with India — Kathmandu, Pokhara, Chitwan and the Himalaya. Tailor-made by WTI Tours & Travels.',
    paragraphs: [
      'Nepal, a landlocked country between India and China, is known for its mountain peaks. The small country contains eight of the 10 highest peaks in the world, including Mount Everest and Kanchenjunga — the world’s tallest and third tallest respectively.',
      'Kathmandu, the capital city, has many Buddhist temples shrouded in a mystic aura. The ornate royal palaces and temples, built in traditional pagoda style, function as open administrative centres, allowing tourists to explore their elegance.',
    ],
    bestSeason: 'Winter, Fall, Spring',
    popular: ['Kathmandu', 'Pokhara', 'Everest', 'Chitwan Park', 'Annapurna', 'Langtang'],
  },
  {
    id: 'bhutan',
    slug: 'bhutan',
    name: 'Bhutan',
    heading: 'Holidays in Bhutan',
    strapline: 'The Land of Dragons — monasteries, fortresses and fresh mountain air.',
    metaDescription:
      'Bhutan cultural and heritage tours — Paro, Thimphu, Punakha and Tiger’s Nest. Designed by WTI Tours & Travels.',
    paragraphs: [
      'Bhutan is known for its natural beauty, forest conservation, Gross National Happiness, great culture and heritage, and biodiversity. Bhutan covers 72% forest area, making it one of the largest biodiversity places in the world.',
      'Bhutan’s architecture, landscape and prominent attractions are like no other in this world. The Land of Dragons has left every visitor spell-bound, as each one’s visit is completely different from the other. Await the pleasant greetings of fresh mountain air, clean roads, zero pollution, zero traffic, a simple yet beautiful culture and happy people. Bhutan is replete with monasteries and fortresses, and nature has blessed it with the kind of beauty that cannot be seen anywhere else in the world.',
    ],
    bestSeason: 'All year round',
    popular: ['India', 'Leh and Ladakh', 'Bhutan'],
  },
  {
    id: 'sri-lanka',
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    heading: 'Holidays in Sri Lanka',
    strapline: 'Pristine beaches, ancient ruins and elephants at the waterhole.',
    metaDescription:
      'Sri Lanka tour packages — Colombo, Kandy, Sigiriya, Nuwara Eliya and Yala. Traditional tours tailor-made by WTI Tours & Travels.',
    paragraphs: [
      'Sri Lanka tourism takes you through a picturesque landscape of pristine beaches, irresistible food, ancient ruins and the warmth of the locals. The history, culture and natural beauty of Sri Lanka are irrefutably alluring. Situated between the Indian subcontinent and the rest of South East Asia, it’s a place you haven’t been to yet, but most certainly should.',
      'An incredible country with more than 2000 years of rich heritage, a Sri Lanka tour would let you rest your eyes upon legendary temples with boastful details, or bump nose to trunk with majestic elephants heading to their morning waterhole. Encounter water buffalo and leopards in their natural habitat — who can tell the kind of adventures this beautiful country would take you on!',
    ],
    bestSeason: 'All year round',
    popular: ['Colombo', 'Nuwara Eliya', 'Kandy', 'Yala', 'Polonnaruwa', 'Sigiriya', 'Dambulla'],
  },
];

export const getDestination = (slug: string): Destination => {
  const found = destinations.find((d) => d.slug === slug);
  if (!found) throw new Error(`Unknown destination: ${slug}`);
  return found;
};

export const destinationUrl = (slug: string) => `/destinations/${slug}/`;
