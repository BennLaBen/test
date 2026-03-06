const fs = require('fs')
const path = require('path')

const products = require('../src/data/shop/products.json')
const seedFile = path.join(__dirname, '..', 'src', 'app', 'api', 'v2', 'migrate', 'seed-marketplace', 'route.ts')

const catMap = {
  towing: 'barres-remorquage',
  handling: 'rollers-manutention',
  maintenance: 'outillage-maintenance',
  gse: 'ground-support',
}

// Build clean product entries
const entries = products.map(x => {
  return JSON.stringify({
    id: x.id,
    slug: x.slug,
    name: x.name,
    category: catMap[x.category] || x.category,
    description: x.description,
    shortDescription: x.shortDescription,
    features: x.features,
    specs: x.specs,
    image: x.image,
    gallery: x.gallery || [],
    compatibility: x.compatibility,
    usage: x.usage,
    material: x.material,
    inStock: x.inStock,
    isNew: x.isNew,
    isFeatured: x.isFeatured,
    certifications: x.certifications,
    standards: x.standards,
    applications: x.applications,
    leadTime: x.leadTime,
    warranty: x.warranty,
  })
})

const productsBlock = 'const PRODUCTS = [\n' + entries.map(e => '  ' + e).join(',\n') + '\n]'

// Read existing file
let content = fs.readFileSync(seedFile, 'utf8')

// Replace the PRODUCTS block (from "const PRODUCTS = [" to the closing "]")
const startMarker = 'const PRODUCTS = ['
const startIdx = content.indexOf(startMarker)
if (startIdx === -1) {
  console.error('Could not find PRODUCTS array start')
  process.exit(1)
}

// Find the closing ] — it's on a line by itself after all the product entries
// We need to find the ]\n that closes the array
let bracketCount = 0
let endIdx = -1
for (let i = startIdx + startMarker.length; i < content.length; i++) {
  if (content[i] === '[') bracketCount++
  if (content[i] === ']') {
    if (bracketCount === 0) {
      endIdx = i + 1
      break
    }
    bracketCount--
  }
}

if (endIdx === -1) {
  console.error('Could not find PRODUCTS array end')
  process.exit(1)
}

content = content.substring(0, startIdx) + productsBlock + content.substring(endIdx)

fs.writeFileSync(seedFile, content, 'utf8')
console.log(`✓ Seed route regenerated with ${products.length} products`)
console.log(`  File: ${seedFile}`)
