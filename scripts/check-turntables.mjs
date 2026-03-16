import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const products = await prisma.marketProduct.findMany({
  where: { turntable: { not: null } },
  select: { id: true, slug: true, name: true, turntable: true }
})

console.log(`Found ${products.length} products with turntable data:\n`)
for (const p of products) {
  const t = p.turntable
  console.log(`  ${p.slug}:`)
  console.log(`    turntable: ${JSON.stringify(t)}`)
  console.log()
}

await prisma.$disconnect()
