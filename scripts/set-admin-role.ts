import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Force update role to ADMIN
  const user = await prisma.user.update({
    where: { email: 'admin@lledo.com' },
    data: { role: 'ADMIN' },
  })
  console.log('Done:', user.email, user.role)
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
})
