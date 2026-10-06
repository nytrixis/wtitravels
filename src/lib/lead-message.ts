/** Human-readable enquiry text used for WhatsApp / email fallbacks. Pure, shared by client + server. */
const LABELS: Record<string, string> = {
  interest: 'Interested in',
  package: 'Package',
  vehicle: 'Vehicle',
  arrival: 'Arrival',
  departure: 'Departure',
  month: 'Travel month',
  hotel: 'Hotels',
  adults: 'Adults',
  children: 'Children',
  infants: 'Infants',
  country: 'From',
  phone: 'Phone',
  email: 'Email',
  message: 'Notes',
};

const titleCase = (key: string): string => key.replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

export function whatsappText(fields: Record<string, string>, tour?: string): string {
  const lines = [`Hi! I'd like a quote${tour ? ` for "${tour}"` : ''}.`, ''];
  if (fields.name) lines.push(`Name: ${fields.name}`);
  for (const [key, raw] of Object.entries(fields)) {
    const value = raw?.trim();
    if (key === 'name' || !value || value === '0') continue;
    if (key === 'interest' && tour) continue;
    lines.push(`${LABELS[key] ?? titleCase(key)}: ${value}`);
  }
  return lines.join('\n');
}
