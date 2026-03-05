import { PrismaClient } from '@prisma/client'
import productsData from '../src/data/shop/products.json'
import categoriesData from '../src/data/shop/categories.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  RESET MARKETPLACE — Suppression de toutes les données produits...\n')

  // ── 1. Delete all dependent records first (foreign keys) ──
  const deletedDocs = await prisma.productDocument.deleteMany({})
  console.log(`  🗑️  ${deletedDocs.count} product documents supprimés`)

  const deletedSerials = await prisma.serialNumber.deleteMany({})
  console.log(`  🗑️  ${deletedSerials.count} serial numbers supprimés`)

  const deletedQuoteItems = await prisma.quoteItem.deleteMany({})
  console.log(`  🗑️  ${deletedQuoteItems.count} quote items supprimés`)

  const deletedOrderItems = await prisma.orderItem.deleteMany({})
  console.log(`  🗑️  ${deletedOrderItems.count} order items supprimés`)

  // ── 2. Delete all products ──
  const deletedProducts = await prisma.marketProduct.deleteMany({})
  console.log(`  🗑️  ${deletedProducts.count} produits supprimés`)

  // ── 3. Delete all categories ──
  const deletedCategories = await prisma.marketCategory.deleteMany({})
  console.log(`  🗑️  ${deletedCategories.count} catégories supprimées`)

  console.log('\n✅ Toutes les données marketplace supprimées.\n')

  // ══════════════════════════════════════════
  // RE-SEED
  // ══════════════════════════════════════════

  console.log('🚀 Re-seed marketplace avec les nouvelles données...\n')

  // ── 4. Seed Categories ──
  console.log('📦 Création des catégories...')
  const categoryMap = new Map<string, string>()

  for (const cat of categoriesData) {
    const created = await prisma.marketCategory.create({
      data: {
        slug: cat.slug,
        label: cat.label,
        description: cat.description,
        icon: cat.icon,
        order: categoriesData.indexOf(cat),
      },
    })
    categoryMap.set(cat.id, created.id)
    console.log(`  ✅ ${cat.label} (${created.id})`)
  }

  // ── 5. Seed Products ──
  console.log('\n🔧 Création des produits...')

  for (const p of productsData as any[]) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.log(`  ⚠️ Skipping ${p.name} — catégorie inconnue "${p.category}"`)
      continue
    }

    const product = await prisma.marketProduct.create({
      data: {
        slug: p.slug,
        sku: p.id,
        name: p.name,
        categoryId,
        description: p.description,
        shortDescription: p.shortDescription,
        features: p.features || [],
        specs: p.specs || {},
        tolerances: p.tolerances || null,
        materialsData: p.materials || null,
        image: p.image,
        gallery: p.gallery || [],
        priceDisplay: p.priceDisplay || 'SUR DEVIS',
        compatibility: p.compatibility || [],
        usage: p.usage || [],
        material: p.material || '',
        inStock: p.inStock ?? true,
        stockQuantity: p.inStock ? 10 : 0,
        minOrder: p.minOrder || 1,
        leadTime: p.leadTime || null,
        warranty: p.warranty || null,
        isNew: p.isNew ?? false,
        isFeatured: p.isFeatured ?? false,
        published: true,
        model3d: p.model3d || null,
        boughtTogether: p.boughtTogether || [],
        faq: p.faq || null,
        certifications: p.certifications || [],
        standards: p.standards || [],
        applications: p.applications || [],
      },
    })

    console.log(`  ✅ ${product.name} (SKU: ${product.sku})`)
  }

  // ── 6. Summary ──
  const productCount = await prisma.marketProduct.count()
  const categoryCount = await prisma.marketCategory.count()

  console.log('\n════════════════════════════════════')
  console.log(`✅ Reset + Reseed terminé !`)
  console.log(`   📦 ${categoryCount} catégories`)
  console.log(`   🔧 ${productCount} produits`)
  console.log('════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Reset failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
