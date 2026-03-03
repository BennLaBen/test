import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, firstName: true, lastName: true }
  })
  console.log('=== USERS ===')
  users.forEach(u => console.log(`  ${u.role.padEnd(10)} ${u.email} (${u.firstName} ${u.lastName})`))
  
  const admins = await prisma.admin.findMany({
    select: { email: true, role: true, firstName: true, lastName: true, isActive: true }
  })
  console.log('\n=== ADMINS ===')
  admins.forEach(a => console.log(`  ${a.role.padEnd(12)} ${a.email} (${a.firstName} ${a.lastName}) active=${a.isActive}`))
}

main().finally(() => process.exit(0))
