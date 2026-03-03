import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMINS = [
  { email: 'alban.geay@mpeb13.com', firstName: 'Alban', lastName: 'GEAY', company: 'MPEB' as const, role: 'ADMIN' as const },
  { email: 'rayancarre68@gmail.com', firstName: 'Rayan', lastName: 'CARRE', company: 'MPEB' as const, role: 'SUPER_ADMIN' as const },
  { email: 'lionel.chemin@mpeb13.com', firstName: 'Lionel', lastName: 'CHEMIN', company: 'MPEB' as const, role: 'ADMIN' as const },
  { email: 'webmaster@mpeb13.com', firstName: 'Webmaster', lastName: 'MPEB', company: 'MPEB' as const, role: 'SUPER_ADMIN' as const },
]

async function main() {
  const password = 'Lledo2026!'
  const hash = await bcrypt.hash(password, 12)

  for (const admin of ADMINS) {
    // Upsert in Admin table
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: { role: admin.role, isActive: true, emailVerified: true, passwordHash: hash },
      create: {
        email: admin.email,
        passwordHash: hash,
        firstName: admin.firstName,
        lastName: admin.lastName,
        company: admin.company,
        role: admin.role,
        isActive: true,
        emailVerified: true,
      },
    })
    console.log(`✅ Admin table: ${admin.email} → ${admin.role}`)

    // Upsert in User table (for v2 auth login)
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { role: 'ADMIN', password: hash },
      create: {
        email: admin.email,
        password: hash,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'ADMIN',
        company: 'LLEDO Industries',
      },
    })
    console.log(`✅ User table:  ${admin.email} → ADMIN`)
  }

  // Verify
  const admins = await prisma.admin.findMany({ select: { email: true, role: true, isActive: true } })
  const users = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { email: true, role: true } })
  console.log(`\n=== VERIFICATION ===`)
  console.log(`Admin table: ${admins.length} admins`)
  admins.forEach(a => console.log(`  ${a.role.padEnd(12)} ${a.email} active=${a.isActive}`))
  console.log(`User table: ${users.length} admin users`)
  users.forEach(u => console.log(`  ${u.role.padEnd(10)} ${u.email}`))
  console.log(`\nMot de passe: ${password}`)
}

main().finally(() => process.exit(0))
