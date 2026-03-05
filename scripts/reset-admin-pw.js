require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()
  const hash = await bcrypt.hash('Wissrayan*2024', 12)
  
  // Reset Admin table
  const admins = await prisma.admin.findMany({ select: { id: true, email: true } })
  console.log('=== Table Admin ===')
  console.log('Admins trouves:', admins.length)
  for (const a of admins) {
    await prisma.admin.update({
      where: { id: a.id },
      data: { passwordHash: hash, loginAttempts: 0, lockedUntil: null, isActive: true }
    })
    console.log('  Reset:', a.email)
  }

  // Reset User table
  const users = await prisma.user.findMany({ select: { id: true, email: true } })
  console.log('\n=== Table User ===')
  console.log('Users trouves:', users.length)
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { password: hash }
    })
    console.log('  Reset:', u.email)
  }
  
  await prisma.$disconnect()
  console.log('\nTous les mots de passe reset a: Wissrayan*2024')
}

main().catch(console.error)
