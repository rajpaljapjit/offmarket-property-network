/**
 * In-memory rate limiter.
 * Works within a single serverless instance. On Vercel, multiple warm instances
 * each have their own store — this is best-effort protection and still blocks
 * most automated abuse hitting the same instance.
 */
const store = {}
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function rateLimit(key, max) {
  const now = Date.now()
  if (!store[key] || now - store[key].first > WINDOW_MS) {
    store[key] = { count: 1, first: now }
    return false // not limited
  }
  store[key].count++
  return store[key].count > max // true = blocked
}

export function clearLimit(key) {
  delete store[key]
}

export function getIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}
