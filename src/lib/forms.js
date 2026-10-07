import { forms } from '../config/site.js'

// Posts the form as JSON to the configured endpoint, or resolves after a short delay in demo mode.
export async function submitForm(kind, data) {
  if (!forms.endpoint) {
    await new Promise((r) => setTimeout(r, 900))
    return { ok: true, demo: true }
  }
  const res = await fetch(forms.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ form: kind, ...data }),
  })
  if (!res.ok) throw new Error(`Submission failed (${res.status})`)
  return { ok: true }
}
