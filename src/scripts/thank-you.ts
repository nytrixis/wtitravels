import { getConfig } from './telemetry/config';
import { track } from './telemetry';
import { recallLead, whatsappUrl } from './lead';
import { session } from './telemetry/storage';

/** Fires the conversion exactly once per lead, then personalises the page. */
export function initThankYou(): void {
  const lead = recallLead();
  const fired = session.get('wti_lead_fired');

  if (lead && fired !== lead.id) {
    session.set('wti_lead_fired', lead.id);
    track('generate_lead', {
      lead_id: lead.id,
      source: lead.meta.source,
      tour: lead.meta.tour,
      currency: 'INR',
      value: 4000, // nominal lead value for ad-platform bidding — tune with real close rates
    });
    const { googleAds, googleAdsLeadLabel } = getConfig().tracking;
    if (googleAds && googleAdsLeadLabel) {
      window.gtag?.('event', 'conversion', { send_to: `${googleAds}/${googleAdsLeadLabel}`, transaction_id: lead.id });
    }
  }

  const name = lead?.fields.name?.split(' ')[0];
  const el = document.querySelector<HTMLElement>('[data-first-name]');
  if (el && name) el.textContent = `, ${name}`;

  const wa = document.querySelector<HTMLAnchorElement>('[data-lead-whatsapp]');
  if (wa && lead) wa.href = whatsappUrl(lead);
  const ref = document.querySelector<HTMLElement>('[data-lead-ref]');
  if (ref && lead) {
    ref.textContent = lead.id;
    ref.closest<HTMLElement>('[data-lead-ref-wrap]')?.removeAttribute('hidden');
  }
}
