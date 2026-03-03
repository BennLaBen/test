import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const ADMINS = [
  { email: 'alban.geay@mpeb13.com', firstName: 'Alban', lastName: 'GEAY' },
  { email: 'rayancarre68@gmail.com', firstName: 'Rayan', lastName: 'CARRE' },
  { email: 'lionel.chemin@mpeb13.com', firstName: 'Lionel', lastName: 'CHEMIN' },
  { email: 'webmaster@mpeb13.com', firstName: 'Webmaster', lastName: 'MPEB' },
]

// POST /api/v2/migrate/fix-admins — Fix admin accounts directly on production DB
export async function POST(request: NextRequest) {
  const log: string[] = []

  try {
    const password = 'Lledo2026!'
    const hash = await bcrypt.hash(password, 12)

    for (const admin of ADMINS) {
      // Upsert in User table
      await prisma.user.upsert({
        where: { email: admin.email },
        update: {
          password: hash,
          role: 'ADMIN',
          firstName: admin.firstName,
          lastName: admin.lastName,
        },
        create: {
          email: admin.email,
          password: hash,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: 'ADMIN',
          company: 'LLEDO Industries',
        },
      })
      log.push(`✅ User "${admin.email}" → ADMIN + password reset`)
    }

    // Verify all
    const users = await prisma.user.findMany({
      where: { email: { in: ADMINS.map(a => a.email) } },
      select: { email: true, role: true },
    })

    log.push(`\n=== VERIFICATION ===`)
    users.forEach(u => log.push(`  ${u.email}: role=${u.role}`))

    // Test bcrypt on first user
    const testUser = await prisma.user.findUnique({
      where: { email: 'rayancarre68@gmail.com' },
      select: { password: true },
    })
    if (testUser) {
      const ok = await bcrypt.compare(password, testUser.password)
      log.push(`\nbcrypt verify for rayancarre68: ${ok}`)
    }

    log.push(`\nPassword for all: ${password}`)
    return NextResponse.json({ success: true, log })
  } catch (error: any) {
    log.push(`❌ ERROR: ${error.message}`)
    return NextResponse.json({ success: false, log, error: error.message }, { status: 500 })
  }
}
