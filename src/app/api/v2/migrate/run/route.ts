import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import productsJson from '@/data/shop/products.json'
import categoriesJson from '@/data/shop/categories.json'

export const dynamic = 'force-dynamic'

// POST /api/v2/migrate/run — Migrate JSON data to Railway PostgreSQL
export async function POST(request: NextRequest) {
  const results: string[] = []

  try {
    // ─── 1. MIGRATE CATEGORIES ───
    results.push('=== CATEGORIES ===')
    const categoryMap = new Map<string, string>() // old id → new db id

    for (const cat of categoriesJson as any[]) {
      const existing = await prisma.marketCategory.findUnique({ where: { slug: cat.slug || cat.id } })
      if (existing) {
        categoryMap.set(cat.id, existing.id)
        results.push(`  ⏭ Category "${cat.label}" already exists`)
        continue
      }

      const created = await prisma.marketCategory.create({
        data: {
          slug: cat.slug || cat.id,
          label: cat.label,
          description: cat.description || null,
          icon: cat.icon || null,
          order: categoriesJson.indexOf(cat),
        },
      })
      categoryMap.set(cat.id, created.id)
      results.push(`  ✅ Category "${cat.label}" created`)
    }

    // ─── 2. MIGRATE PRODUCTS ───
    results.push('\n=== PRODUCTS ===')
    let created = 0
    let skipped = 0

    for (const p of productsJson as any[]) {
      const existing = await prisma.marketProduct.findUnique({ where: { slug: p.slug } })
      if (existing) {
        skipped++
        results.push(`  ⏭ Product "${p.name}" already exists`)
        continue
      }

      const categoryId = categoryMap.get(p.category)
      if (!categoryId) {
        results.push(`  ❌ Product "${p.name}" — category "${p.category}" not found`)
        continue
      }

      await prisma.marketProduct.create({
        data: {
          slug: p.slug,
          sku: p.id, // Use product ID as SKU
          name: p.name,
          categoryId,
          description: p.description || '',
          shortDescription: p.shortDescription || '',
          features: p.features || [],
          specs: p.specs || {},
          tolerances: p.tolerances || null,
          materialsData: p.materials || null,
          image: p.image || '',
          gallery: p.gallery || [],
          priceDisplay: p.priceDisplay || 'SUR DEVIS',
          compatibility: p.compatibility || [],
          usage: p.usage || [],
          material: p.material || '',
          inStock: p.inStock ?? true,
          isNew: p.isNew ?? false,
          isFeatured: p.isFeatured ?? false,
          boughtTogether: p.boughtTogether || [],
          faq: p.faq || null,
          certifications: p.certifications || [],
          standards: p.standards || [],
          applications: p.applications || [],
          leadTime: p.leadTime || null,
          minOrder: p.minOrder || 1,
          warranty: p.warranty || null,
        },
      })
      created++
      results.push(`  ✅ Product "${p.name}" created`)
    }

    results.push(`\n=== SUMMARY ===`)
    results.push(`Categories: ${categoryMap.size} mapped`)
    results.push(`Products: ${created} created, ${skipped} skipped`)

    // ─── 3. VERIFY COUNTS ───
    const catCount = await prisma.marketCategory.count()
    const prodCount = await prisma.marketProduct.count()
    results.push(`\nDB totals: ${catCount} categories, ${prodCount} products`)

    return NextResponse.json({ success: true, log: results })
  } catch (error: any) {
    results.push(`\n❌ ERROR: ${error.message}`)
    return NextResponse.json({ success: false, log: results, error: error.message }, { status: 500 })
  }
}
