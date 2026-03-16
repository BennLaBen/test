import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Check all products for turntable data
const products = await prisma.marketProduct.findMany({
  select: { id: true, slug: true, name: true, turntable: true }
})

const withTurntable = products.filter(p => p.turntable)
console.log(`Products with turntable data: ${withTurntable.length}`)
for (const p of withTurntable) {
  console.log(`  ${p.slug}: ${JSON.stringify(p.turntable)}`)
}

// Check if barre-remorquage-h145-standard has turntable
const h145 = products.find(p => p.slug === 'barre-remorquage-h145-standard')
console.log(`\nbarre-remorquage-h145-standard turntable: ${JSON.stringify(h145?.turntable)}`)

// The correct Blob baseUrl for h145
const BLOB_BASE = 'https://e3qul3jaazerxvv6.public.blob.vercel-storage.com/turntable/barre-remorquage-h145-standard'

if (h145 && !h145.turntable) {
  console.log('\nActivating turntable for barre-remorquage-h145-standard with Blob URL...')
  await prisma.marketProduct.update({
    where: { id: h145.id },
    data: {
      turntable: {
        enabled: true,
        hFrames: 36,
        vLevels: 3,
        format: 'webp',
        baseUrl: BLOB_BASE,
      }
    }
  })
  console.log('Done! Turntable activated with correct Blob URL.')
} else if (h145?.turntable) {
  const t = h145.turntable
  if (typeof t === 'object' && t !== null && 'baseUrl' in t) {
    const currentBase = (t).baseUrl
    if (currentBase !== BLOB_BASE) {
      console.log(`\nFixing baseUrl: ${currentBase} -> ${BLOB_BASE}`)
      await prisma.marketProduct.update({
        where: { id: h145.id },
        data: {
          turntable: { ...t, baseUrl: BLOB_BASE }
        }
      })
      console.log('Done! Turntable baseUrl fixed.')
    } else {
      console.log('\nbaseUrl already correct!')
    }
  }
}

await prisma.$disconnect()
