import { PrismaClient } from '@prisma/client'
import productsData from '../src/data/shop/products.json'
import categoriesData from '../src/data/shop/categories.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding marketplace data to Railway PostgreSQL...\n')

  // ── 1. Seed Categories ──
  console.log('📦 Creating categories...')
  const categoryMap = new Map<string, string>()

  for (const cat of categoriesData) {
    const created = await prisma.marketCategory.upsert({
      where: { slug: cat.slug },
      update: {
        label: cat.label,
        description: cat.description,
        icon: cat.icon,
      },
      create: {
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

  // ── 2. Seed Products ──
  console.log('\n🔧 Creating products...')

  for (const p of productsData as any[]) {
    const categoryId = categoryMap.get(p.category)
    if (!categoryId) {
      console.log(`  ⚠️ Skipping ${p.name} — unknown category "${p.category}"`)
      continue
    }

    const product = await prisma.marketProduct.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.id,
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
      create: {
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

  // ── 3. Summary ──
  const productCount = await prisma.marketProduct.count()
  const categoryCount = await prisma.marketCategory.count()

  console.log('\n════════════════════════════════════')
  console.log(`✅ Seed complete!`)
  console.log(`   📦 ${categoryCount} categories`)
  console.log(`   🔧 ${productCount} products`)
  console.log('════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
