import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const NEW_EMAIL = 'webmaster@mpeb13.com'
const NEW_PASSWORD = 'AAS+DE$x3Zgf'
const OLD_EMAIL = 'admin@lledo-industries.com'

async function main() {
  console.log('\n🔐 Mise à jour du super-admin...')

  const hash = await bcrypt.hash(NEW_PASSWORD, 12)

  // Check if new email already exists
  const existing = await prisma.admin.findUnique({ where: { email: NEW_EMAIL } })

  if (existing) {
    await prisma.admin.update({
      where: { email: NEW_EMAIL },
      data: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true, emailVerified: true },
    })
    console.log(`✅ Admin ${NEW_EMAIL} mis à jour`)
  } else {
    // Migrate old admin
    const old = await prisma.admin.findUnique({ where: { email: OLD_EMAIL } })
    if (old) {
      await prisma.admin.update({
        where: { email: OLD_EMAIL },
        data: { email: NEW_EMAIL, passwordHash: hash },
      })
      console.log(`✅ Admin migré de ${OLD_EMAIL} → ${NEW_EMAIL}`)
    } else {
      await prisma.admin.create({
        data: {
          email: NEW_EMAIL,
          passwordHash: hash,
          firstName: 'Rayan',
          lastName: 'CARRE',
          company: 'MPEB',
          role: 'SUPER_ADMIN',
          isActive: true,
          emailVerified: true,
          twoFactorEnabled: false,
        },
      })
      console.log(`✅ Nouveau super-admin créé: ${NEW_EMAIL}`)
    }
  }

  console.log(`\n📧 Email: ${NEW_EMAIL}`)
  console.log(`🔑 Mot de passe: ${NEW_PASSWORD}`)
  console.log(`🔗 Login: http://localhost:3000/admin/login\n`)
}

main()
  .catch((e) => { console.error('❌ Erreur:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
