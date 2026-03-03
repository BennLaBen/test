import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const ADMINS_TO_CREATE = [
  {
    email: 'alban.geay@mpeb13.com',
    firstName: 'Alban',
    lastName: 'GEAY',
    company: 'MPEB' as const,
    role: 'ADMIN' as const,
  },
  {
    email: 'rayancarre68@gmail.com',
    firstName: 'Rayan',
    lastName: 'CARRE',
    company: 'MPEB' as const,
    role: 'SUPER_ADMIN' as const,
  },
  {
    email: 'lionel.chemin@mpeb13.com',
    firstName: 'Lionel',
    lastName: 'CHEMIN',
    company: 'MPEB' as const,
    role: 'ADMIN' as const,
  },
  {
    email: 'webmaster@mpeb13.com',
    firstName: 'Webmaster',
    lastName: 'MPEB',
    company: 'MPEB' as const,
    role: 'SUPER_ADMIN' as const,
  },
]

// POST /api/v2/migrate/admins — Create admin accounts on Railway DB
export async function POST(request: NextRequest) {
  const results: string[] = []

  try {
    const tempPassword = 'Lledo2026!'
    const hashedPassword = await bcrypt.hash(tempPassword, 12)

    for (const admin of ADMINS_TO_CREATE) {
      // Check Admin table
      const existingAdmin = await prisma.admin.findUnique({ where: { email: admin.email } })
      if (existingAdmin) {
        results.push(`⏭ Admin "${admin.email}" already exists in Admin table`)
        continue
      }

      await prisma.admin.create({
        data: {
          email: admin.email,
          passwordHash: hashedPassword,
          firstName: admin.firstName,
          lastName: admin.lastName,
          company: admin.company,
          role: admin.role,
          isActive: true,
          emailVerified: true,
        },
      })
      results.push(`✅ Admin "${admin.email}" created (${admin.role})`)

      // Also ensure they exist in User table for v2 auth
      const existingUser = await prisma.user.findUnique({ where: { email: admin.email } })
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: admin.email,
            password: hashedPassword,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: 'ADMIN',
            company: 'LLEDO Industries',
          },
        })
        results.push(`  + User "${admin.email}" also created in User table`)
      }
    }

    // Verify
    const adminCount = await prisma.admin.count()
    const userAdminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    results.push(`\n=== DB: ${adminCount} admins, ${userAdminCount} admin users ===`)
    results.push(`\nMot de passe temporaire pour tous: ${tempPassword}`)

    return NextResponse.json({ success: true, log: results })
  } catch (error: any) {
    results.push(`❌ ERROR: ${error.message}`)
    return NextResponse.json({ success: false, log: results, error: error.message }, { status: 500 })
  }
}
