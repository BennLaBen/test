'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
  const key = '_lledo_sid'
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(key, sid)
  }
  return sid
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    // Skip admin pages
    if (!pathname || pathname.startsWith('/admin')) return
    // Avoid double-tracking on same path
    if (pathname === lastPath.current) return
    lastPath.current = pathname

    const sessionId = getSessionId()

    // Small delay to not block page render
    const timer = setTimeout(() => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          sessionId,
        }),
      }).catch(() => {})
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
