import { site } from '@/config/site';

/** The 12 service promises from the original homepage, grouped into six pillars. */
export const pillars = [
  {
    icon: 'compass',
    title: 'Tailor-made, never templated',
    body: 'A leading travel company specialised in tailor-made plans for private and group tours — with the flexibility to travel privately or join a group.',
  },
  {
    icon: 'clock',
    title: `Your proposal in ${site.claims.proposalHours} hours`,
    body: 'Get a detailed tour schedule within 24 hours. Crystal-clear pricing with no hidden costs — and confirmation on an immediate basis.',
  },
  {
    icon: 'tag',
    title: 'Best price, guaranteed',
    body: `Quality service at the best price. Hotels from ${site.claims.hotelRange}, luxury coaches and cars with English-speaking chauffeurs.`,
  },
  {
    icon: 'phone',
    title: `A tour manager on call ${site.claims.support}`,
    body: 'A friendly tour manager who looks after your trip around the clock, from the airport welcome to your final transfer.',
  },
  {
    icon: 'plane',
    title: 'A complete travel solution',
    body: 'Hotels, private transport, guides and — if you need them — air tickets, all arranged by one team.',
  },
  {
    icon: 'heart',
    title: `${site.claims.happyClients} happy travelers`,
    body: 'Travelers from across the world have trusted us with their India journeys. 100% satisfaction is the standard we work to.',
  },
] as const;

export const process = [
  {
    step: '01',
    title: 'Tell us your dream',
    body: 'Share your dates, interests and group size — a two-minute form, a WhatsApp message or a call.',
  },
  {
    step: '02',
    title: 'Get your plan in 24 hours',
    body: 'A detailed day-by-day proposal with hotels and transparent pricing. Refine it with us until it feels right.',
  },
  {
    step: '03',
    title: 'Travel with a friend on call',
    body: 'Confirm quickly, then travel with a dedicated tour manager reachable 24x7 and an English-speaking guide at every stop.',
  },
] as const;

export const faqs = [
  {
    q: 'How quickly will I receive a proposal?',
    a: `You will get your proposal within ${site.claims.proposalHours} hours of sending an enquiry, with a detailed day-by-day tour schedule.`,
  },
  {
    q: 'Can I customise a tour or travel privately?',
    a: 'Yes. Every itinerary on this site is a sample intended to give you a general idea. We tailor plans for private travelers and groups, and you may also join group departures.',
  },
  {
    q: 'What kind of hotels do you use?',
    a: `From 3★ hotels to 5★ luxury hotels, plus heritage palaces and boutique stays — including Oberoi, Taj and ITC properties on our luxury tours. Budget tours use budget heritage and boutique hotels and home stays.`,
  },
  {
    q: 'Do you provide guides and drivers?',
    a: 'Yes — English-speaking (or any other language-speaking) guides and escorts, and luxury coach or car rental with experienced English-speaking chauffeurs.',
  },
  {
    q: 'How do I pay, and what is the cancellation policy?',
    a: 'An advance payment holds your booking and the balance is due before the services begin. Cancellation charges range from 10% (45 days before arrival) to no refund (48 hours before or no-show). Please read our Terms & Conditions for the full policy, including peak-season rules.',
  },
  {
    q: 'When is the best time to visit?',
    a: 'For the Golden Triangle the best months are October to mid-April, when the weather is pleasant — not too hot and not too cold. India overall is best from September to April.',
  },
  {
    q: 'Does the price include flights and travel insurance?',
    a: 'Flights and insurance are not included unless stated. We can arrange air tickets on request, and we advise travelers to take travel insurance in their home country.',
  },
] as const;

/** From the original About page (placeholder lorem-ipsum blocks removed). */
export const about = {
  strapline: 'Mastering the art of perfect tailor-made individual and group tours.',
  company: [
    'We are India’s leading young travel company, headquartered in New Delhi with travel associates all over the Indian sub-continent. We have embarked on incessant promotion of India, Nepal, Bhutan, Tibet, Sri Lanka and Maldives as a unique special-interest cultural destination to tour operators across the globe.',
  ],
  services: [
    'Cultural tours, adventure tours, beach tours, eco tourism, festival holidays, golf tours, art and crafts tours, heritage holidays, museum tours, backwater tours, wildlife tours, religious tours, yoga and meditation tours, rejuvenation and Ayurveda tours, safaris, cruises, hill station tours, special-interest tours, conferences, incentives and much more across the Indian subcontinent.',
  ],
  serviceBullets: [
    'Best rates from 3★ hotels to 5★ luxury hotels in India',
    'Luxury coach and luxury car rental with experienced English-speaking chauffeurs',
    'English-speaking or any other language-speaking guides and escorts',
  ],
  values: [
    {
      title: 'Travel & tourism',
      body: 'Travel and tourism is the largest service industry in India. It provides heritage, cultural, medical, business and sports tourism. The main objective of this sector is to develop and promote tourism, maintain the competitiveness of India as a tourist destination, and improve and expand existing tourism products to ensure employment generation and economic growth.',
    },
    {
      title: 'Sustainable travel',
      body: 'Sustainable travel is about travelling in a way that asks us to consider the impact our travel choices have on the environment and local cultures. Ideally, our choices have a positive impact: they support local communities and do not degrade the environment. We might take fewer flights and more trains; we might stay at a locally owned home stay and spend our money in locally owned shops and restaurants — keeping the money in the local economy.',
    },
    {
      title: 'Mission & values',
      body: 'Providing innovative, qualitative, customer-focused, high-quality professional service — result oriented, with excellence in service delivery, dedicated, speedy and at a competitive price as demanded in the market — carries out our core values and fulfils our mission.',
    },
  ],
  india: [
    'Indian tourism is a rapidly growing industry. India has several unique temples famous for their cultural heritage, various wildlife sanctuaries, and is surrounded by the Indian Ocean, the Himalayas, the Bay of Bengal and the Arabian Sea. It’s a multilingual country where people speak different languages, and every foreigner has a dream to visit this fascinating land — with waterfalls, deserts and famous rivers like the Ganga, Yamuna and Indus.',
    'Tourism infrastructure comprises four basic elements: accommodation facilities, food and beverage facilities, accompanying facilities and communication facilities. India has all types of accommodation, excellent roads, all types of transport services and tourist guides in every language.',
  ],
  people:
    'We are creating happiness amongst travelers through new experiences every day. We provide the best quality service to our clients from the day their travel begins to the moment their journey ends. Our group travel skills and leadership have positioned the company among the leading travel companies of India. A company that promises to maintain the standards of its services and create a relationship with its growing customer base for generations to come is always called the best of the rest.',
  ecoTourism:
    'Ecotourism is a form of tourism involving visiting fragile, pristine and relatively undisturbed natural areas, intended as a low-impact and often small-scale alternative to standard commercial mass tourism. Ecotourism focuses on socially responsible travel, personal growth and environmental sustainability.',
  expertise: [
    { label: 'Luxury tours', value: 90 },
    { label: 'Heritage tours', value: 80 },
    { label: 'Wildlife tours', value: 80 },
    { label: 'Leisure tours', value: 95 },
  ],
} as const;
