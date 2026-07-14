const ipRequests = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  ip: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = ipRequests.get(ip)

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  entry.count++
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining: maxRequests - entry.count }
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of ipRequests) {
    if (now > value.resetAt) ipRequests.delete(key)
  }
}, 300_000)
