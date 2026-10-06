#!/usr/bin/env node
/**
 * Pre-launch checklist. Run: npm run check:launch
 * Reads the hardcoded values in src/config/site.ts. Exits 1 while anything BLOCKING is unresolved.
 */
import { readFileSync } from 'node:fs';

const src = readFileSync('src/config/site.ts', 'utf8');
const grab = (key) => src.match(new RegExp(`\\b${key}:\\s*'([^']*)'`))?.[1]?.trim() ?? '';

const checks = [
  { level: 'block', ok: grab('endpoint') && src.match(/forms:\s*\{\s*endpoint:\s*'([^']+)'/), msg: 'forms.endpoint set — without it leads only hand off to WhatsApp and can be lost' },
  { level: 'block', ok: /^918?\d{9,}$/.test(grab('whatsapp')), msg: 'contact.whatsapp is a real number' },
  { level: 'warn', ok: grab('ga4') || grab('gtm'), msg: 'Analytics: tracking.ga4 or tracking.gtm' },
  { level: 'warn', ok: grab('googleAds') && grab('googleAdsLeadLabel'), msg: 'Google Ads conversion: tracking.googleAds + googleAdsLeadLabel' },
  { level: 'warn', ok: grab('metaPixel'), msg: 'Meta Pixel: tracking.metaPixel' },
  { level: 'warn', ok: grab('clarity'), msg: 'Microsoft Clarity (heatmaps/recordings): tracking.clarity' },
  { level: 'warn', ok: grab('google'), msg: 'Google Search Console verification: verification.google' },
  { level: 'warn', ok: grab('instagram') || grab('facebook'), msg: 'At least one social profile URL (social.*)' },
  { level: 'warn', ok: false, msg: `Confirm the live domain in src/config/site.ts and astro.config.mjs (currently ${grab('url')})` },
];

let blocking = 0;
for (const c of checks) {
  const pass = Boolean(c.ok);
  if (!pass && c.level === 'block') blocking++;
  console.log(`${pass ? '  ✓' : c.level === 'block' ? '  ✗' : '  !'}  ${c.msg}`);
}
console.log('\nAlso do by hand: confirm the marketing claims in src/config/site.ts, review the Terms & Privacy');
console.log('text in src/content/legal/, and confirm image licences in docs/IMAGE-CREDITS.json.');
if (blocking) {
  console.log(`\n${blocking} blocking item(s) — not ready to launch.`);
  process.exit(1);
}
console.log('\nAll blocking items resolved.');
