// Single source for company details. Replace the placeholders when real information is available;
// every component reads from here, so nothing else needs to change.
export const PLACEHOLDER = 'Information available on request.'

export const company = {
  name: 'Aarshiv Private Limited',
  shortName: 'Aarshiv',
  tagline: 'We Export Your Need.',
  supportingTagline: 'From India to the World — Quality You Can Trust.',
}

// Leave a value empty ('') to show the placeholder text instead of a link.
export const contact = {
  email: '',
  phone: '',
  whatsapp: '', // international format without + or spaces, e.g. 919876543210
  address: '',
  website: '',
  linkedin: '',
  instagram: '',
}

// Where form submissions are POSTed as JSON (e.g. Formspree, a serverless function).
// Empty means the forms run in demo mode: they validate and show the success state but send nothing.
// Never put secret keys here — this file ships to the browser.
export const forms = {
  endpoint: '',
}

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'products', label: 'Products' },
  { id: 'process', label: 'Export Process' },
  { id: 'markets', label: 'Global Markets' },
  { id: 'why', label: 'Why Aarshiv' },
  { id: 'contact', label: 'Contact' },
]
