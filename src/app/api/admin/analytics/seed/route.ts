import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminFromRequest } from '@/lib/auth/admin-guard'

const PAGES = ['/', '/contact', '/carriere', '/expertises', '/vision', '/blog', '/cas-clients', '/aerotools', '/connexion']
const COUNTRIES = ['FR', 'FR', 'FR', 'FR', 'FR', 'US', 'GB', 'DE', 'MA', 'BE', 'CH', 'ES', 'CA']
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'New York', 'London', 'Berlin', 'Casablanca', 'Bruxelles']
const DEVICES = ['desktop', 'desktop', 'desktop', 'mobile', 'mobile', 'tablet']
const BROWSERS = ['Chrome', 'Chrome', 'Chrome', 'Firefox', 'Safari', 'Edge']
const OS_LIST = ['Windows', 'Windows', 'macOS', 'Linux', 'iOS', 'Android']
const REFERRERS = [null, null, null, null, 'https://www.google.com', 'https://www.google.fr', 'https://www.linkedin.com', 'https://www.bing.com', 'https://www.facebook.com']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST() {
  try {
    const admin = await getAdminFromRequest()
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Accès non autorisé' }, { status: 403 })
    }

    const now = new Date()
    const records: any[] = []

    // Generate 30 days of data with realistic patterns
    for (let day = 0; day < 30; day++) {
      const date = new Date(now)
      date.setDate(date.getDate() - day)

      // More traffic on weekdays, less on weekends
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const baseViews = isWeekend ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 20) + 10

      // Generate unique sessions for this day
      const sessionsCount = Math.floor(baseViews * 0.6)
      const sessions: string[] = []
      for (let s = 0; s < sessionsCount; s++) {
        sessions.push(`seed_${day}_${s}_${Math.random().toString(36).slice(2, 8)}`)
      }

      for (let v = 0; v < baseViews; v++) {
        const hour = Math.floor(Math.random() * 14) + 8 // 8h-22h
        const minute = Math.floor(Math.random() * 60)
        const viewDate = new Date(date)
        viewDate.setHours(hour, minute, Math.floor(Math.random() * 60))

        records.push({
          path: pick(PAGES),
          referrer: pick(REFERRERS),
          country: pick(COUNTRIES),
          city: pick(CITIES),
          device: pick(DEVICES),
          browser: pick(BROWSERS),
          os: pick(OS_LIST),
          sessionId: pick(sessions),
          createdAt: viewDate,
        })
      }
    }

    // Insert in batches
    await prisma.pageView.createMany({ data: records })

    return NextResponse.json({ success: true, count: records.length })
  } catch (error) {
    console.error('[Seed Analytics] Error:', error)
    return NextResponse.json({ success: false, error: 'Erreur seed' }, { status: 500 })
  }
}
