# WTI Tours & Travels — website

Static, SEO-first tour-operator site built with [Astro 5](https://astro.build). Every tour, itinerary
and page from the original site is carried over; the design, motion, lead funnel, telemetry and SEO are new.

```bash
npm install
npm run dev              # http://localhost:4321
npm run build            # type-check + static build → dist/
npm run preview          # serve dist/ locally
```

Node ≥ 20.3. Everything below is plain Astro + TypeScript — no UI framework, no CSS framework.

## Launch checklist

Everything configurable lives as plain constants in **`src/config/site.ts`** — no `.env`, no host settings.
`npm run check:launch` prints what is still open (exits non-zero while anything blocking remains).

1. **Contact details** — already in `site.ts` (mobile 87663 73398, landline 011-4505 4254, contact person RP Mishra 95403 51000, sales@wtitravels.com, Mahipalpur address, WhatsApp = the mobile).
2. **Lead endpoint** → `forms.endpoint` (+ `forms.accessKey`). Leads are POSTed as JSON — Web3Forms
   (`https://api.web3forms.com/submit`) or Formspree (`https://formspree.io/f/xxxx`) both work in minutes and email you each lead.
   *Until this is set, a submit hands the lead to WhatsApp so nothing is lost, but it relies on the visitor pressing send.*
3. **Domain** → `url` in `site.ts` and the matching line in `astro.config.mjs` (canonicals, sitemap, OG tags, robots).
4. **Logo** → the WTI mark (orange W · green T · white I) is a vector rebuild from the brand description. Swap in the original artwork via `src/components/ui/Logo.astro`, `public/favicon.svg`, `public/logo.svg`, `public/apple-touch-icon.png`.
5. **Telemetry IDs** → `tracking.ga4` (or `gtm`), `metaPixel`, `clarity`, `googleAds` + `googleAdsLeadLabel`. See [docs/TELEMETRY.md](docs/TELEMETRY.md).
6. **Confirm the marketing claims** in `site.ts` (`claims`: "15,000+ happy travelers", 24-hour proposal, 3★–5★ hotels, 24x7 support) and the working hours. They were carried over / assumed and must be true for WTI.
7. **Review legal text** — `src/content/legal/*.md` is the original Terms & Privacy with the brand swapped. Have it reviewed for WTI.
8. **Image licences** — `docs/IMAGE-CREDITS.json` (hero photography; verify the CC0 items on their source pages). Tour photos are the originals from the previous site.
9. **Search Console** → `verification.google`, submit `/sitemap-index.xml`. Add the Google Business Profile.
10. `npm run build && npm run audit:seo` — then deploy.

## Design & motion

- **Palette** from the WTI mark — logo orange `#ff7a1a`, flag green, white — on a cool off-white page with deep-forest dark sections (`src/styles/tokens.css`; one place to change it).
- **Type:** Bricolage Grotesque (display) · Instrument Serif italic (one accent word per headline) · Instrument Sans (body). Self-hosted.
- **Motifs:** the logo's circles, arches, concentric rings; Ministry of Tourism and IATO badges in the hero, footer, About and Contact.
- **Motion** (`src/scripts/motion/`, `src/styles/motion.css`): inertial smooth scroll (Lenis, desktop pointers only), masked word-by-word headline reveals, image "curtain" openings, scroll-linked parallax (CSS `animation-timeline`, Chromium/Safari 26+), count-up stats, destination ticker, pointer-following destination previews, a contextual "View" cursor over tour cards, pointer-aware button fills, magnetic CTAs, header that hides on scroll down. Everything is progressive enhancement and switches off under `prefers-reduced-motion`. The hero animates in pure CSS so it never waits on JavaScript.
- Add `data-split` to a heading for the word reveal, `data-reveal` (`up|fade|scale|left|right`) to any block, `data-count-to="15000"` on a number, `data-cursor="View"` on a card, `data-parallax="slow|fast|rev"` on an image.

## Where things live

```
src/
  config/site.ts          brand, contact, integrations — driven by env vars
  data/
    tours.json            all 41 tours (title, itinerary, gallery, themes…) — the content source of truth
    collections.ts        tour styles + holiday packages (copy + which tours belong)
    destinations.ts       India / Nepal / Bhutan / Sri Lanka copy
    taxi.ts, content.ts   taxi fares; trust pillars, process steps, FAQs, About copy
    reviews.ts            real testimonials — section stays hidden until you add some
  content/blog, legal     Markdown (Astro content collections)
  lib/                    tours accessors, JSON-LD builders, hero registry, lead message
  components/             ui/ layout/ tours/ forms/ marketing/ home/ seo/ analytics/
  scripts/                client TypeScript: telemetry/, forms.ts, lead.ts, thank-you.ts
  styles/                 tokens.css (design tokens) · global.css · forms.css
  pages/                  routes
scripts/                  check-launch.mjs · audit-dist.mjs
tests/e2e.mjs             browser checks (filters, form → conversion, tracking, drawer, consent)
```

**Add a tour:** append an object to `src/data/tours.json`, drop its images into `src/assets/tours/`, and list
the slug in a collection/featured set if wanted. Pages, sitemap, schema, filters, related tours and enquiry
forms are generated automatically. **Change design:** edit the tokens in `src/styles/tokens.css`.

## Site map (78 pages)

`/` · `/tours/` (live filters, URL-shareable) · `/tours/[slug]/` ×41 · `/collections/[slug]/` ×17 (styles + holiday packages) ·
`/destinations/[india|nepal|bhutan|sri-lanka]/` · `/hire-a-taxi/` + 2 route pages · `/about/` · `/contact/` ·
`/blog/` + 2 posts + `/rss.xml` · `/plan-your-trip/` (conversion page) · `/thank-you/` (noindex, fires the conversion) ·
`/lp/golden-triangle-tour/` (noindex ad landing page) · Terms · Privacy · 404.

## The lead funnel

| Stage | What visitors see | Conversion paths |
|---|---|---|
| Discover | Hero + tour finder, destinations, popular tours, blog | `Plan my trip`, finder → `/tours/` |
| Compare | `/tours/` filters, collections, tour pages (gallery, itinerary, facts) | Sticky quote card on every tour; mobile bar (Call · WhatsApp · Quote) |
| Convert | Compact forms on tours/CTA bands, 2-step planner on `/plan-your-trip/`, taxi booking | Form · WhatsApp · call |
| Rescue | Exit-intent (desktop) / engaged-reader (mobile) pop-up, once per week | Free-itinerary mini form |
| Confirm | `/thank-you/` — one conversion event per lead, next steps, WhatsApp fast-track | — |

Every lead carries first-touch and last-touch attribution (UTMs, gclid/fbclid/msclkid, referrer, landing page, visit count) and its `source` (which form on which page).

## SEO

Per-page title (auto-shortened to fit results), description, canonical, Open Graph/Twitter cards with generated
1200×630 images; JSON-LD: `TravelAgency`, `WebSite`+SearchAction, `BreadcrumbList`, `TouristTrip` (itinerary + offer
where a price exists), `ItemList` on listings, `FAQPage`, `BlogPosting`; sitemap + robots + RSS; semantic HTML,
one `<h1>` per page; `noindex` on thank-you, 404 and the ad landing page; responsive AVIF/WebP-optimised images
with explicit dimensions (CLS ≈ 0); self-hosted fonts, preloaded. `npm run audit:seo` guards it in CI.

Measured with Lighthouse (mobile emulation): Performance 91–98, Accessibility 100, Best-Practices 100, SEO 100.

## Testing

```bash
npm run build && npm run preview &
npm run test:e2e        # needs Chrome: CHROME_PATH=/usr/bin/google-chrome
npm run audit:seo       # after build
npm run check           # astro check (types)
```

## Deploy

Any static host. Build command `npm run build`, output `dist/`. `public/_headers` (security headers + immutable
caching for `/_astro/*`) works on Cloudflare Pages and Netlify; mirror it in `vercel.json` for Vercel.
No environment variables are needed.

## Decisions & known limits

- **Astro 5.18, not 6/7:** Astro 6+ needs Node ≥ 22.12 (this machine has Node 20). `npm audit` flags Astro advisories that
  concern server islands, `define:vars` and spread attribute names — none are used by this static site — plus nested `sharp`
  (overridden to a patched version). Upgrade to Node 22 + Astro 7 when convenient; the code uses only stable APIs.
- **Prices:** the original site showed `$0.00` on almost every tour, so only real prices are displayed, converted from the original dollar prices to rupees at ₹85 = $1 (`src/lib/money.ts`): Agra day trip ₹5,100, taxi fares ₹11,050–₹1,14,750.
  Everything else is "Custom quote" — the funnel's job is to get that quote request.
- **Logo & badges:** the original WTI logo file couldn't be found online (wtitravels.com is a parked page), so the mark is recreated in vector. The Ministry of Tourism "Incredible India — Approved" badge and the IATO member logo are the official artwork (`src/assets/brand/`); display them only while WTI's recognition and IATO membership are current.
- **Photography:** tour photos are the originals from the old site (mostly 900 px wide — fine for cards/galleries, soft if enlarged).
  Hero/destination photos are 2400 px. Replace any tour image by overwriting its file in `src/assets/tours/`.
- **Content cleanup:** brand name swapped, ~10 obvious typos fixed (e.g. "Chandni Chock"), template lorem-ipsum and empty "0 reviews"
  blocks dropped, the broken duplicate tour pages (`/product/golden-triangle-tours/`, `…-kerala-tour/`) omitted.
