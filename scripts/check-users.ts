import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, firstName: true },
  })
  console.log('Users in DB:')
  users.forEach(u => console.log(`  ${u.email} | role: ${u.role} | name: ${u.firstName}`))
  await prisma.$disconnect()
}
main()
