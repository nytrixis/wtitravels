/**
 * End-to-end checks against a running site (npm run preview).
 *   BASE_URL=http://127.0.0.1:4321 CHROME_PATH=/usr/bin/google-chrome npm run test:e2e
 * Covers: tour filtering, lead form → thank-you conversion (fires once), attribution capture,
 * funnel events, mobile drawer, consent. Needs the placeholder (no form endpoint) config.
 */
import { chromium } from 'playwright-core';
const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const results = [];
const ok = (name, cond, extra='') => { results.push([cond ? 'PASS' : 'FAIL', name, extra]); };

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  return { ctx, page, errs };
}

// 1. Tours filtering
{
  const { ctx, page, errs } = await newPage();
  await page.goto(base + '/tours/', { waitUntil: 'networkidle' });
  const count = async () => (await page.textContent('[data-filter-count]')).trim();
  ok('tours: initial count', (await count()) === 'Showing 41 of 41 tours', await count());
  await page.click('.pill[data-group="region"][data-value="nepal"]');
  ok('tours: region=nepal → 2', (await count()) === 'Showing 2 of 41 tours', await count());
  ok('tours: url updated', page.url().includes('region=nepal'));
  await page.click('[data-filter-reset]');
  await page.click('.pill[data-group="days"][data-value="short"]');
  const shortCount = await count(); ok('tours: ≤4 days filter', /Showing (\d+) of 41/.test(shortCount), shortCount);
  await page.click('[data-filter-reset]');
  await page.fill('[data-filter-search]', 'zzzzqq');
  ok('tours: empty state', await page.isVisible('[data-filter-empty]'));
  await page.fill('[data-filter-search]', 'kerala');
  const kc = await count(); ok('tours: search kerala', /Showing [1-9]/.test(kc), kc);
  await page.selectOption('[data-filter-sort]', 'longest');
  const firstDays = await page.$eval('[data-tour-card]:not([hidden])', () => { const c=[...document.querySelectorAll('[data-tour-card]')].find(x=>!x.closest('li').hidden); return c.dataset.days; });
  ok('tours: sort longest first', Number(firstDays) >= 10, firstDays);
  await page.goto(base + '/tours/?region=bhutan&style=culture', { waitUntil: 'networkidle' });
  ok('tours: deep-link filters', (await count()).startsWith('Showing 1 of'), await count());
  ok('tours: no console errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 2. Lead form (no endpoint configured → hand-off) + conversion
{
  const { ctx, page, errs } = await newPage();
  await page.goto(base + '/plan-your-trip/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('[data-consent]')?.setAttribute('hidden',''));
  ok('plan: step 1 visible, step 2 hidden', (await page.isVisible('[data-step]:nth-of-type(1)')) && !(await page.isVisible('fieldset[data-step]:nth-of-type(2) input[name=name]')));
  await page.selectOption('select[name=interest]', { index: 2 });
  await page.click('[data-next]');
  ok('plan: advanced to step 2', await page.isVisible('input[name=name]'));
  // validation
  await page.click('button[type=submit]');
  ok('plan: validation blocks empty submit', page.url().includes('/plan-your-trip/'));
  const err = await page.textContent('#plan-name-err');
  ok('plan: inline error shown', /required/i.test(err), err);
  await page.fill('input[name=name]', 'Test User');
  await page.fill('input[name=email]', 'bad');
  await page.fill('input[name=phone]', '+1 555 123 4567');
  await page.click('button[type=submit]');
  ok('plan: invalid email rejected', /valid email/i.test(await page.textContent('#plan-email-err')));
  await page.fill('input[name=email]', 'test@example.com');
  const [popup] = await Promise.all([
    page.context().waitForEvent('page', { timeout: 3000 }).catch(() => null),
    page.click('button[type=submit]'),
  ]);
  await page.waitForURL('**/thank-you/**', { timeout: 5000 }).catch(()=>{});
  ok('plan: redirected to /thank-you/', page.url().includes('/thank-you/'), page.url());
  await page.waitForTimeout(800);
  const dl = await page.evaluate(() => (window.dataLayer||[]).map(e => e.event).filter(Boolean));
  ok('thank-you: generate_lead fired once', dl.filter(e => e === 'generate_lead').length === 1, dl.join(','));
  ok('thank-you: first name personalised', (await page.textContent('[data-first-name]')).includes('Test'));
  ok('thank-you: noindex', (await page.getAttribute('meta[name=robots]','content')).includes('noindex'));
  await page.reload({ waitUntil: 'networkidle' });
  const dl2 = await page.evaluate(() => (window.dataLayer||[]).map(e => e.event).filter(Boolean));
  ok('thank-you: reload does NOT double-fire conversion', !dl2.includes('generate_lead'), dl2.join(','));
  ok('plan/thanks: no console errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 3. Funnel events on a tour page
{
  const { ctx, page, errs } = await newPage();
  await page.goto(base + '/tours/3-days-golden-triangle-tour/?utm_source=google&utm_medium=cpc&utm_campaign=gt&gclid=abc123', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('[data-consent]')?.setAttribute('hidden',''));
  const ev = async () => page.evaluate(() => window.dataLayer.map(e => e.event).filter(Boolean));
  ok('tour: view_tour fired', (await ev()).includes('view_tour'), (await ev()).join(','));
  const attr = await page.evaluate(() => JSON.parse(localStorage.getItem('wti_first_touch')));
  ok('tour: UTM + gclid captured (first touch)', attr.utm_source === 'google' && attr.gclid === 'abc123', JSON.stringify(attr));
  await page.click('[data-toggle-all]');
  ok('tour: itinerary_toggle_all tracked', (await ev()).includes('itinerary_toggle_all'));
  await page.click('[data-open="0"]');
  await page.waitForFunction(() => document.querySelector('[data-lightbox]')?.open);
  ok('tour: lightbox opens', await page.evaluate(() => document.querySelector('[data-lightbox]').open));
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('Escape');
  await page.click('a[href^="tel:"]');
  ok('tour: click_call tracked', (await ev()).includes('click_call'));
  await page.fill('#tour-name', 'Quick Lead'); await page.fill('#tour-email', 'q@example.com');
  const hp = await page.evaluate(() => document.querySelector('[data-tour]').closest('form')?.dataset.tour || document.querySelector('form[data-lead-form]').dataset.tour);
  ok('tour: form is bound to this tour', hp.includes('Golden Triangle'), hp);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(300);
  ok('tour: scroll_depth tracked', (await ev()).includes('scroll_depth'), (await ev()).join(','));
  ok('tour: no console errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 4. Mobile drawer + sticky bar
{
  const { ctx, page, errs } = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('[data-consent]')?.setAttribute('hidden',''));
  ok('mobile: sticky CTA bar visible', await page.isVisible('.bar'));
  await page.click('[data-menu-open]');
  ok('mobile: drawer opens', await page.isVisible('#mobile-menu'));
  await page.click('#mobile-menu summary:has-text("Destinations")');
  await page.click('#mobile-menu a[href="/destinations/nepal/"]');
  await page.waitForURL('**/destinations/nepal/');
  ok('mobile: drawer nav works', page.url().endsWith('/destinations/nepal/'));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
  ok('mobile: no horizontal overflow (nepal)', !overflow);
  ok('mobile: no console errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 5. Consent
{
  const { ctx, page } = await newPage({ timezoneId: 'Europe/Berlin' });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  ok('consent: banner shown for EU timezone', await page.isVisible('[data-consent]'));
  await page.click('[data-consent-reject]');
  const c = await page.evaluate(() => JSON.parse(localStorage.getItem('wti_consent_v1')));
  ok('consent: reject stored', c && c.analytics === false && c.decided === true, JSON.stringify(c));
  await ctx.close();
}

await browser.close();
for (const [s, n, e] of results) console.log(s, n, e ? '→ ' + e : '');
const failures = results.filter(r => r[0] === 'FAIL').length;
console.log(failures, 'failures of', results.length);
process.exit(failures ? 1 : 0);
