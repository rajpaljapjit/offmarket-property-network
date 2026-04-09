export function sanitise(str) {
  if (typeof str !== 'string') return ''
  return str
    .trim()
    .replace(/[<>'"`;]/g, '')
    .slice(0, 500)
}

export function sanitiseEmail(str) {
  if (typeof str !== 'string') return ''
  return str.trim().toLowerCase().slice(0, 254)
}

export function sanitiseNumber(str) {
  if (typeof str !== 'string') return ''
  return str.trim().replace(/[^0-9+\-\s()]/g, '').slice(0, 20)
}
