#!/usr/bin/env node
/**
 * Pre-launch checklist. Run: npm run check:launch
 * Exits 1 if anything BLOCKING is unresolved (so it can gate CI/deploys).
 */
import { existsSync, readFileSync } from 'node:fs';

const env = { ...process.env };
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*(?:#.*)?$/);
    if (m && !(m[1] in env)) env[m[1]] = m[2].trim();
  }
}
const v = (k) => (env[k] ?? '').trim();

const checks = [
  { level: 'block', ok: v('PUBLIC_SITE_URL') && !v('PUBLIC_SITE_URL').includes('your-domain'), msg: 'PUBLIC_SITE_URL is the live domain (canonicals, sitemap, OG tags) — currently www.wtitravels.com, confirm it' },
  { level: 'block', ok: v('PUBLIC_PHONE') && !v('PUBLIC_PHONE').includes('00000'), msg: 'PUBLIC_PHONE is a real number' },
  { level: 'block', ok: v('PUBLIC_EMAIL') && !v('PUBLIC_EMAIL').includes('your-domain'), msg: 'PUBLIC_EMAIL is a real inbox' },
  { level: 'block', ok: v('PUBLIC_FORM_ENDPOINT'), msg: 'PUBLIC_FORM_ENDPOINT set — without it leads only hand off to WhatsApp/email and can be lost' },
  { level: 'block', ok: v('PUBLIC_WHATSAPP').replace(/\D/g, '').length >= 8, msg: 'PUBLIC_WHATSAPP set (international format, digits only)' },
  { level: 'warn', ok: v('PUBLIC_ADDRESS') && v('PUBLIC_ADDRESS') !== 'Office address, City, Country', msg: 'PUBLIC_ADDRESS set' },
  { level: 'warn', ok: v('PUBLIC_GA4_ID') || v('PUBLIC_GTM_ID'), msg: 'Analytics: PUBLIC_GA4_ID or PUBLIC_GTM_ID' },
  { level: 'warn', ok: v('PUBLIC_GADS_ID') && v('PUBLIC_GADS_LEAD_LABEL'), msg: 'Google Ads conversion: PUBLIC_GADS_ID + PUBLIC_GADS_LEAD_LABEL' },
  { level: 'warn', ok: v('PUBLIC_META_PIXEL_ID'), msg: 'Meta Pixel: PUBLIC_META_PIXEL_ID' },
  { level: 'warn', ok: v('PUBLIC_CLARITY_ID'), msg: 'Microsoft Clarity (heatmaps/recordings): PUBLIC_CLARITY_ID' },
  { level: 'warn', ok: v('PUBLIC_GSC_VERIFICATION'), msg: 'Google Search Console verification: PUBLIC_GSC_VERIFICATION' },
  { level: 'warn', ok: v('PUBLIC_SOCIAL_INSTAGRAM') || v('PUBLIC_SOCIAL_FACEBOOK'), msg: 'At least one social profile URL' },
];

let blocking = 0;
for (const c of checks) {
  const pass = Boolean(c.ok);
  if (!pass && c.level === 'block') blocking++;
  console.log(`${pass ? '  ✓' : c.level === 'block' ? '  ✗' : '  !'}  ${c.msg}`);
}
console.log('\nAlso do by hand: replace the placeholder logo (src/components/ui/Logo.astro, public/favicon.svg,');
console.log('public/apple-touch-icon.png), confirm the marketing claims in src/config/site.ts, review the');
console.log('Terms & Privacy text in src/content/legal/, and confirm image licences in docs/IMAGE-CREDITS.json.');
if (blocking) {
  console.log(`\n${blocking} blocking item(s) — not ready to launch.`);
  process.exit(1);
}
console.log('\nAll blocking items resolved.');
