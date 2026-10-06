import { whatsappText } from '@/lib/lead-message';
import { getAttribution } from './telemetry/attribution';
import { getConfig } from './telemetry/config';
import { local, session } from './telemetry/storage';

export type LeadFields = Record<string, string>;

export interface LeadMeta {
  source: string;
  tour?: string;
}

export interface LeadRecord {
  id: string;
  fields: LeadFields;
  meta: LeadMeta;
}

const LEAD_KEY = 'wti_lead';

export const newLeadId = (): string => `L${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

/** Remember the lead for the thank-you page and to suppress further pop-ups. */
export function rememberLead(record: LeadRecord): void {
  session.set(LEAD_KEY, JSON.stringify(record));
  local.set('wti_lead_at', String(Date.now()));
}

export function recallLead(): LeadRecord | null {
  const raw = session.get(LEAD_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LeadRecord;
  } catch {
    return null;
  }
}

export const hasSubmittedLead = (): boolean => Boolean(local.get('wti_lead_at'));

export const whatsappUrl = (record: LeadRecord): string => {
  const { whatsapp } = getConfig();
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappText(record.fields, record.meta.tour))}`;
};

export const mailtoUrl = (record: LeadRecord): string => {
  const { email } = getConfig();
  const subject = `Trip enquiry — ${record.fields.name ?? ''}`.trim();
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(whatsappText(record.fields, record.meta.tour))}`;
};

export const hasEndpoint = (): boolean => Boolean(getConfig().formEndpoint);

/** POSTs the lead as JSON to the configured form endpoint. Throws on failure. */
export async function sendToEndpoint(record: LeadRecord): Promise<void> {
  const { formEndpoint, formAccessKey, siteName } = getConfig();
  const body = {
    ...(formAccessKey ? { access_key: formAccessKey } : {}),
    subject: `New enquiry — ${record.fields.name ?? 'website visitor'} (${record.meta.tour || record.meta.source})`,
    from_name: siteName,
    lead_id: record.id,
    source: record.meta.source,
    tour: record.meta.tour ?? '',
    page_url: location.href,
    submitted_at: new Date().toISOString(),
    ...record.fields,
    ...getAttribution(),
  };

  const res = await fetch(formEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`);
}
