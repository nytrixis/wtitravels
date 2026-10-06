import type { ImageMetadata } from 'astro';
import tajMahal from '@/assets/hero/taj-mahal.jpg';
import hawaMahal from '@/assets/hero/hawa-mahal.jpg';
import amberFort from '@/assets/hero/amber-fort.jpg';
import udaipur from '@/assets/hero/udaipur.jpg';
import jodhpur from '@/assets/hero/jodhpur.jpg';
import jaisalmer from '@/assets/hero/jaisalmer.jpg';
import kerala from '@/assets/hero/kerala.jpg';
import varanasi from '@/assets/hero/varanasi.jpg';
import kashmir from '@/assets/hero/kashmir.jpg';
import nepal from '@/assets/hero/nepal.jpg';
import bhutan from '@/assets/hero/bhutan.jpg';
import sriLanka from '@/assets/hero/sri-lanka.jpg';
import delhi from '@/assets/hero/delhi.jpg';
import hampi from '@/assets/hero/hampi.jpg';
import portrait from '@/assets/hero/rajasthan-portrait.jpg';
import palaceJali from '@/assets/hero/palace-jali.jpg';

export const heroes = {
  tajMahal, hawaMahal, amberFort, udaipur, jodhpur, jaisalmer, kerala, varanasi,
  kashmir, nepal, bhutan, sriLanka, delhi, hampi, portrait, palaceJali,
} satisfies Record<string, ImageMetadata>;

export type Hero = { image: ImageMetadata; focus: string };

const h = (image: ImageMetadata, focus = 'center'): Hero => ({ image, focus });

/** Page hero per collection slug. Falls back to the Taj. */
const collectionHeroes: Record<string, Hero> = {
  'luxury-tours': h(palaceJali, '50% 55%'),
  'budget-tours': h(hawaMahal, '50% 30%'),
  'group-tours': h(udaipur, '50% 55%'),
  'short-tours': h(delhi, '50% 55%'),
  'golden-triangle-tours': h(tajMahal, '50% 60%'),
  'rajasthan-tours': h(jaisalmer, '50% 50%'),
  'fort-and-palaces-of-rajasthan-tours': h(amberFort, '50% 45%'),
  'kerala-tours': h(kerala, '50% 50%'),
  'south-india-tours': h(hampi, '50% 50%'),
  'heritage-and-cultural': h(portrait, '50% 35%'),
  'north-india-cultural-tours': h(varanasi, '50% 45%'),
  'taj-mahal-tours': h(tajMahal, '50% 60%'),
  'kashmir-tours-packages': h(kashmir, '50% 50%'),
  'shimla-manali-tours': h(kashmir, '50% 45%'),
  'beach-holidays': h(kerala, '50% 55%'),
  'wildlife-india-tours': h(jodhpur, '50% 40%'),
  'rural-village-tours': h(portrait, '50% 35%'),
};

export const collectionHero = (slug: string): Hero => collectionHeroes[slug] ?? h(tajMahal, '50% 60%');

export const destinationHeroes: Record<string, Hero> = {
  india: h(hawaMahal, '50% 35%'),
  nepal: h(nepal, '50% 45%'),
  bhutan: h(bhutan, '50% 40%'),
  'sri-lanka': h(sriLanka, '50% 40%'),
};
