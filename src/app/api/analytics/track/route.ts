import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/analytics/track — record a page view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referrer, sessionId } = body

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    // Skip admin pages
    if (path.startsWith('/admin')) {
      return NextResponse.json({ success: true, skipped: true })
    }

    // Parse user-agent for device/browser/os
    const ua = request.headers.get('user-agent') || ''
    const device = /Mobile|Android|iPhone|iPad/i.test(ua)
      ? (/iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile')
      : 'desktop'
    const browser = parseBrowser(ua)
    const os = parseOS(ua)

    // Get geo from headers (works with Vercel, Cloudflare, nginx)
    const country = request.headers.get('x-vercel-ip-country')
      || request.headers.get('cf-ipcountry')
      || request.headers.get('x-country')
      || null
    const city = request.headers.get('x-vercel-ip-city')
      || request.headers.get('cf-ipcity')
      || request.headers.get('x-city')
      || null

    // For local dev, use a fallback
    const finalCountry = country || (process.env.NODE_ENV === 'development' ? 'FR' : null)

    await prisma.pageView.create({
      data: {
        path: path.split('?')[0], // strip query params
        referrer: referrer || null,
        country: finalCountry,
        city,
        device,
        browser,
        os,
        sessionId: sessionId || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics] Track error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

function parseBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge'
  if (/OPR|Opera/i.test(ua)) return 'Opera'
  if (/Chrome/i.test(ua)) return 'Chrome'
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
  if (/Firefox/i.test(ua)) return 'Firefox'
  return 'Autre'
}

function parseOS(ua: string): string {
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Mac OS X|macOS/i.test(ua)) return 'macOS'
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'Linux'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  return 'Autre'
}
