import {
  hasEndpoint,
  mailtoUrl,
  newLeadId,
  rememberLead,
  sendToEndpoint,
  whatsappUrl,
  type LeadFields,
  type LeadRecord,
} from './lead';
import { getConfig } from './telemetry/config';
import { track } from './telemetry';

const THANK_YOU = '/thank-you/';

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneOk = (v: string) => v.replace(/\D/g, '').length >= 7;

const fieldOf = (input: HTMLElement) => input.closest<HTMLElement>('.field');

function setError(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, message: string): void {
  const field = fieldOf(input);
  const out = field?.querySelector<HTMLElement>('.field__error');
  field?.classList.toggle('is-invalid', Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (out) out.textContent = message;
}

function validateInput(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const value = input.value.trim();
  if (input.required && !value) return 'This field is required.';
  if (value && input.type === 'email' && !emailOk(value)) return 'Enter a valid email address.';
  if (value && input.type === 'tel' && !phoneOk(value)) return 'Enter a valid phone number.';
  return '';
}

function validate(scope: ParentNode): boolean {
  let firstBad: HTMLElement | null = null;
  scope
    .querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')
    .forEach((input) => {
      if (input.type === 'hidden' || input.closest('[hidden]')) return;
      const message = validateInput(input);
      setError(input, message);
      if (message && !firstBad) firstBad = input;
    });
  (firstBad as HTMLElement | null)?.focus();
  return !firstBad;
}

function collect(form: HTMLFormElement): LeadFields {
  const out: LeadFields = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string' && key !== 'botcheck' && value.trim()) out[key] = value.trim();
  });
  return out;
}

function initSteps(form: HTMLFormElement): { go: (n: number) => void } | null {
  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  if (steps.length < 2) return null;
  const bar = form.querySelector<HTMLElement>('[data-progress]');
  const label = form.querySelector<HTMLElement>('[data-progress-label]');
  let current = 0;

  const go = (n: number) => {
    current = Math.max(0, Math.min(steps.length - 1, n));
    steps.forEach((s, i) => (s.hidden = i !== current));
    if (bar) bar.style.setProperty('--progress', `${((current + 1) / steps.length) * 100}%`);
    if (label) label.textContent = `Step ${current + 1} of ${steps.length}`;
    steps[current].querySelector<HTMLElement>('input:not([type=hidden]), select, textarea')?.focus({ preventScroll: true });
  };

  form.querySelectorAll<HTMLElement>('[data-next]').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (!validate(steps[current])) {
        track('form_validation_error', { form: form.dataset.source, step: current + 1 });
        return;
      }
      track('form_step_complete', { form: form.dataset.source, step: current + 1 });
      go(current + 1);
    }),
  );
  form.querySelectorAll<HTMLElement>('[data-prev]').forEach((btn) => btn.addEventListener('click', () => go(current - 1)));
  go(0);
  return { go };
}

/** Number steppers (+/−) for adults / children / infants. */
function initSteppers(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLElement>('[data-stepper]').forEach((el) => {
    const input = el.querySelector<HTMLInputElement>('input');
    if (!input) return;
    const min = Number(input.min || 0);
    const max = Number(input.max || 30);
    const bump = (d: number) => {
      input.value = String(Math.max(min, Math.min(max, Number(input.value || 0) + d)));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    el.querySelector('[data-dec]')?.addEventListener('click', () => bump(-1));
    el.querySelector('[data-inc]')?.addEventListener('click', () => bump(1));
  });
}

function showFailure(form: HTMLFormElement, record: LeadRecord): void {
  const box = form.querySelector<HTMLElement>('[data-failure]');
  if (!box) return;
  box.hidden = false;
  const wa = box.querySelector<HTMLAnchorElement>('[data-fallback-whatsapp]');
  const mail = box.querySelector<HTMLAnchorElement>('[data-fallback-email]');
  if (wa) wa.href = whatsappUrl(record);
  if (mail) mail.href = mailtoUrl(record);
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/** Opens WhatsApp/mail without unloading this page (so tracking and the redirect still run). */
function openExternal(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.rel = 'noopener';
  if (url.startsWith('http')) a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function handleSubmit(form: HTMLFormElement, event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const source = form.dataset.source ?? 'unknown';
  if (!validate(form)) {
    track('form_validation_error', { form: source });
    return;
  }

  // Honeypot — bots fill every field.
  if ((form.elements.namedItem('botcheck') as HTMLInputElement | null)?.value) return;

  const submit = form.querySelector<HTMLButtonElement>('[type=submit]');
  const record: LeadRecord = {
    id: newLeadId(),
    fields: collect(form),
    meta: { source, tour: form.dataset.tour || undefined },
  };

  track('form_submit', { form: source, tour: record.meta.tour, lead_id: record.id });
  submit?.setAttribute('disabled', '');
  submit?.classList.add('is-loading');
  form.querySelector<HTMLElement>('[data-failure]')?.setAttribute('hidden', '');

  // No endpoint configured yet → hand the lead to WhatsApp (or email) so it is never lost.
  if (!hasEndpoint()) {
    rememberLead(record);
    const wa = getConfig().whatsapp;
    openExternal(wa ? whatsappUrl(record) : mailtoUrl(record));
    location.href = `${THANK_YOU}?via=handoff`;
    return;
  }

  try {
    await sendToEndpoint(record);
    rememberLead(record);
    location.href = THANK_YOU;
  } catch (err) {
    track('form_error', { form: source, message: err instanceof Error ? err.message : 'unknown' });
    submit?.removeAttribute('disabled');
    submit?.classList.remove('is-loading');
    showFailure(form, record);
  }
}

function initForm(form: HTMLFormElement): void {
  initSteps(form);
  initSteppers(form);

  let started = false;
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.getAttribute?.('aria-invalid') === 'true') setError(t, validateInput(t));
    if (!started) {
      started = true;
      track('form_start', { form: form.dataset.source, tour: form.dataset.tour || undefined });
    }
  });
  form.addEventListener('focusout', (e) => {
    const t = e.target as HTMLInputElement;
    if (t instanceof HTMLInputElement && t.value && t.type !== 'hidden') setError(t, validateInput(t));
  });
  form.addEventListener('submit', (e) => void handleSubmit(form, e as SubmitEvent));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          io.disconnect();
          track('form_view', { form: form.dataset.source, tour: form.dataset.tour || undefined });
        }
      },
      { threshold: 0.4 },
    );
    io.observe(form);
  }
}

export function initLeadForms(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach(initForm);
}
