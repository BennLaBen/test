#!/usr/bin/env node
/**
 * Validate that all product images in DB exist in public/images/products/
 * Run: npm run validate:images
 */

import { PrismaClient } from '@prisma/client'
import { existsSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

console.log('🔍 Validating product images...\n')

const products = await prisma.marketProduct.findMany({
  select: { id: true, slug: true, name: true, image: true, gallery: true }
})

let errors = 0
let warnings = 0

for (const product of products) {
  // Check main image
  if (product.image) {
    const imagePath = join(process.cwd(), 'public', product.image)
    if (!existsSync(imagePath)) {
      console.error(`❌ [${product.slug}] Main image missing: ${product.image}`)
      errors++
    }
  } else {
    console.warn(`⚠️  [${product.slug}] No main image defined`)
    warnings++
  }

  // Check gallery images
  if (product.gallery && product.gallery.length > 0) {
    for (const galleryImage of product.gallery) {
      const imagePath = join(process.cwd(), 'public', galleryImage)
      if (!existsSync(imagePath)) {
        console.error(`❌ [${product.slug}] Gallery image missing: ${galleryImage}`)
        errors++
      }
    }
  }
}

await prisma.$disconnect()

console.log(`\n════════════════════════════════════`)
console.log(`✅ Validated ${products.length} products`)
console.log(`❌ Errors: ${errors}`)
console.log(`⚠️  Warnings: ${warnings}`)
console.log(`════════════════════════════════════\n`)

if (errors > 0) {
  console.error('🚨 Fix missing images before deploying!')
  process.exit(1)
}

console.log('✅ All product images exist!')
