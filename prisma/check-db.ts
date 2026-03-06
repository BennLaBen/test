import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()

async function main() {
  const products = await p.marketProduct.count()
  const categories = await p.marketCategory.count()
  console.log(`Products: ${products}`)
  console.log(`Categories: ${categories}`)
  
  if (products > 0) {
    const first3 = await p.marketProduct.findMany({ take: 3, select: { sku: true, name: true, published: true } })
    first3.forEach(p => console.log(`  - ${p.sku}: ${p.name} (published: ${p.published})`))
  }
}

main().catch(console.error).finally(() => p.$disconnect())
