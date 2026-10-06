# Telemetry

One function — `track(event, params)` in `src/scripts/telemetry/track.ts` — fans out to every configured sink:
`dataLayer` (GTM), GA4 (`gtag`), Meta Pixel (mapped to standard events), Microsoft Clarity, and an optional
first-party endpoint (`PUBLIC_TELEMETRY_ENDPOINT`, `sendBeacon` JSON). Sinks that aren't loaded are silent no-ops.

## Consent

Third-party tags load **only after consent**. `PUBLIC_CONSENT_MODE=auto` (default): opt-in for Europe/UK timezones,
notice-with-opt-out elsewhere; `strict`: opt-in everywhere. Choice stored in `localStorage` (`wti_consent_v1`);
"Cookie settings" in the footer reopens the banner. Google Consent Mode v2 signals are kept in sync.
*(Have counsel confirm this setup fits the markets you advertise in.)*

## Declarative tracking

Add attributes — no JS needed:

```html
<a href="/plan-your-trip/" data-track="cta_click" data-track-location="header" data-track-label="plan_my_trip">…</a>
<div data-track-impression="view_item_list" data-track-item-id="slug">…</div>   <!-- fires once when 50% visible -->
<div data-track-view="view_tour" data-track-item-id="slug">…</div>              <!-- fires on page load -->
```
`data-track-foo-bar="x"` becomes param `foo_bar: "x"`. `tel:`, `mailto:`, `wa.me` and outbound links are tracked automatically.

## Event catalogue

| Event | When | Key params |
|---|---|---|
| `view_tour`, `view_article` | tour / blog page load | `item_id`, `item_name` |
| `view_item_list`, `select_item` | tour card seen / clicked | `item_id`, `list`, `index` |
| `select_destination`, `select_style`, `select_content` | tile / post clicks | |
| `search`, `search_no_results`, `filter_apply`, `filter_reset` | finder & `/tours/` filters | `term`, `group`, `value`, `results` |
| `cta_click` | any `data-track="cta_click"` | `location`, `label` |
| `click_call`, `click_whatsapp`, `click_email` | contact links (auto) | `location` |
| `click_outbound` | external links (auto) | `destination` |
| `form_view` → `form_start` → `form_step_complete` → `form_submit` | funnel inside every lead form | `form` (= source), `tour` |
| `form_validation_error`, `form_error` | validation / delivery failures | `form`, `step` |
| **`generate_lead`** | `/thank-you/`, once per lead | `lead_id`, `source`, `tour`, `value`, `currency` |
| `popup_view`, `popup_dismiss` | lead pop-up | `trigger`, `reason` |
| `scroll_depth` | 25/50/75/90 % | `percent` |
| `engaged_time` | 15/30/60/120 s visible | `seconds` |
| `itinerary_expand`, `itinerary_toggle_all`, `gallery_open`, `faq_open` | on-page engagement | `tour`, `day` |
| `consent_update` | consent accepted | |

`form` / lead `source` values: `home`, `tour-page`, `tour-bottom`, `popup`, `plan-your-trip`, `contact`, `taxi-*`,
`collection-*`, `destination-*`, `lp-golden-triangle` … — so you can see *which* page and form produces leads.

## Wiring the ad platforms

- **GA4:** set `PUBLIC_GA4_ID`. In GA4 → Admin → Events, mark `generate_lead` (primary), `click_call`, `click_whatsapp` as **key events**.
  Build a funnel exploration: `view_tour` → `form_start` → `form_submit` → `generate_lead`.
- **Google Ads:** set `PUBLIC_GADS_ID` (`AW-…`) and `PUBLIC_GADS_LEAD_LABEL`; the thank-you page sends the conversion with `transaction_id = lead_id` (deduplicated).
  Import `click_call` / `click_whatsapp` from GA4 as secondary conversions.
- **Meta:** set `PUBLIC_META_PIXEL_ID`; `generate_lead` → `Lead`, `view_tour` → `ViewContent`, calls/WhatsApp → `Contact`.
- **Clarity:** set `PUBLIC_CLARITY_ID` for heatmaps and session recordings.
- `value: 4000` (₹) on `generate_lead` is a nominal lead value (see `src/scripts/thank-you.ts`) — tune it to your real close rate × margin.

## Attribution

`captureAttribution()` stores first touch (forever) and last touch (per session): `utm_*`, `gclid`, `gbraid`, `wbraid`,
`fbclid`, `msclkid`, external referrer, landing page, visit count. They ride along on every lead as
`first_*` / `last_*` fields, so each enquiry in your inbox/CRM says where it came from.
