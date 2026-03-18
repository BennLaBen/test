/**
 * Sync products to Railway PostgreSQL DB
 * - Deletes ALL existing products + related records
 * - Creates categories if missing
 * - Inserts all 23 products from the new catalog
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
})

// ─── CATEGORIES ───
const CATEGORIES = [
  { slug: 'barres-remorquage', label: 'Barres de Remorquage', description: 'Barres de remorquage certifiées pour hélicoptères', icon: 'Truck', order: 1 },
  { slug: 'rollers-manutention', label: 'Rollers & Manutention', description: 'Rollers hydrauliques et mécaniques pour hélicoptères', icon: 'RotateCw', order: 2 },
  { slug: 'accessoires', label: 'Accessoires & Options', description: 'Accessoires et options pour barres et rollers', icon: 'Settings2', order: 3 },
]

// ─── PRODUCTS ───
const PRODUCTS = [
  // ══════ BARRES H160 ══════
  {
    sku: 'BR-B160-01', slug: 'barre-remorquage-h160-standard',
    name: 'Barre de Remorquage H160 — Standard',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard à accrochage rapide pour Airbus H160. Système de verrouillage double sécurité, utilisation mono-opérateur.',
    shortDescription: 'Barre standard H160 — Accrochage rapide mono-opérateur',
    compatibility: ['H160'],
    features: ['Système de verrouillage rapide double sécurité', 'Utilisation mono-opérateur', 'Commande de verrouillage déportée', 'Fusibles de traction & torsion', 'Amortisseur de timon', 'Hauteur réglable — 3 positions'],
    material: 'steel',
  },
  {
    sku: 'BR-B160-02', slug: 'barre-remorquage-h160-demontable',
    name: 'Barre de Remorquage H160 — Démontable',
    category: 'barres-remorquage',
    description: 'Barre de remorquage démontable pour Airbus H160. Conception en deux parties pour un transport et stockage facilités.',
    shortDescription: 'Barre démontable H160 — Transport facilité',
    compatibility: ['H160'],
    features: ['Démontable en 2 parties', 'Transport et stockage facilités', 'Système de verrouillage rapide', 'Fusibles de traction & torsion'],
    material: 'steel',
  },
  {
    sku: 'BR-B160-03', slug: 'barre-remorquage-h160-repliable',
    name: 'Barre de Remorquage H160 — Repliable',
    category: 'barres-remorquage',
    description: 'Barre de remorquage repliable pour Airbus H160. Conception compacte avec mécanisme de pliage intégré.',
    shortDescription: 'Barre repliable H160 — Encombrement réduit',
    compatibility: ['H160'],
    features: ['Mécanisme de pliage intégré', 'Encombrement réduit', 'Système de verrouillage rapide', 'Fusibles de traction & torsion'],
    material: 'steel',
  },
  {
    sku: 'BR-B160-04', slug: 'barre-remorquage-h160-flyr-normal',
    name: 'Barre de Remorquage H160 — FLYR Normal',
    category: 'barres-remorquage',
    description: 'Barre de remorquage FLYR normal pour Airbus H160. Version FLYR avec conception optimisée pour opérations fréquentes.',
    shortDescription: 'Barre FLYR Normal H160 — Opérations fréquentes',
    compatibility: ['H160'],
    features: ['Conception FLYR optimisée', 'Opérations fréquentes', 'Système de verrouillage rapide', 'Fusibles de traction & torsion'],
    material: 'steel',
  },
  {
    sku: 'BR-B160-05', slug: 'barre-remorquage-h160-flyr-demontable',
    name: 'Barre de Remorquage H160 — FLYR Démontable en 2 parties',
    category: 'barres-remorquage',
    description: 'Barre de remorquage FLYR démontable en 2 parties pour Airbus H160. Combine les avantages FLYR et la facilité de transport.',
    shortDescription: 'Barre FLYR Démontable H160 — 2 parties, transport facile',
    compatibility: ['H160'],
    features: ['Conception FLYR', 'Démontable en 2 parties', 'Transport facilité', 'Système de verrouillage rapide', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRE H145 ══════
  {
    sku: 'BR-B175-01', slug: 'barre-remorquage-h145-standard',
    name: 'Barre de Remorquage H145 — Standard, collé à distance',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard pour Airbus H145 avec système de collage à distance.',
    shortDescription: 'Barre standard H145 — Collé à distance',
    compatibility: ['H145'],
    features: ['Système collé à distance', 'Utilisation mono-opérateur', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRE AS330 PUMA ══════
  {
    sku: 'BR-B330-01-000', slug: 'barre-remorquage-as330-puma-standard',
    name: 'Barre de Remorquage AS330 Puma — Standard',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard pour Aérospatiale AS330 Puma.',
    shortDescription: 'Barre standard AS330 Puma',
    compatibility: ['SA330'],
    features: ['Conception robuste', 'Utilisation mono-opérateur', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRES AS332 SUPER PUMA ══════
  {
    sku: 'BR-B332-01-000', slug: 'barre-remorquage-as332-super-puma-standard',
    name: 'Barre de Remorquage AS332 Super Puma — Standard',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard pour Airbus AS332 Super Puma.',
    shortDescription: 'Barre standard AS332 Super Puma',
    compatibility: ['AS332'],
    features: ['Conception haute résistance', 'Utilisation mono-opérateur', 'Fusibles de traction & torsion'],
    material: 'steel',
  },
  {
    sku: 'BR-B332-03-000', slug: 'barre-remorquage-as332-super-puma-flyr',
    name: 'Barre de Remorquage AS332 Super Puma — FLYR',
    category: 'barres-remorquage',
    description: 'Barre de remorquage FLYR pour Airbus AS332 Super Puma. Conception FLYR optimisée.',
    shortDescription: 'Barre FLYR AS332 Super Puma',
    compatibility: ['AS332'],
    features: ['Conception FLYR', 'Haute résistance', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRES NH90 CAÏMAN ══════
  {
    sku: 'BR-NH90-01-000', slug: 'barre-remorquage-nh90-caiman-standard',
    name: 'Barre de Remorquage NH90 Caïman — Standard',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard pour NHIndustries NH90 Caïman.',
    shortDescription: 'Barre standard NH90 Caïman',
    compatibility: ['NH90'],
    features: ['Conception militaire renforcée', 'Utilisation mono-opérateur', 'Fusibles de traction & torsion'],
    material: 'steel',
  },
  {
    sku: 'BR-NH90-02-000', slug: 'barre-remorquage-nh90-caiman-courte',
    name: 'Barre de Remorquage NH90 Caïman — Barre courte',
    category: 'barres-remorquage',
    description: 'Barre de remorquage courte pour NHIndustries NH90 Caïman. Version compacte pour espaces restreints.',
    shortDescription: 'Barre courte NH90 Caïman — Espaces restreints',
    compatibility: ['NH90'],
    features: ['Version courte compacte', 'Espaces restreints', 'Conception militaire renforcée', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRES AS365 DAUPHIN / PANTHER ══════
  {
    sku: 'BR-B365-01-000', slug: 'barre-remorquage-as365-dauphin-standard',
    name: 'Barre de Remorquage AS365 Dauphin — Standard',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard pour Airbus AS365 Dauphin.',
    shortDescription: 'Barre standard AS365 Dauphin',
    compatibility: ['SA365'],
    features: ['Conception robuste', 'Utilisation mono-opérateur', 'Fusibles de traction & torsion'],
    material: 'steel',
  },
  {
    sku: 'BR-B365-02-000', slug: 'barre-remorquage-as365-panther-cornes',
    name: 'Barre de Remorquage AS365 Panther — Avec cornes',
    category: 'barres-remorquage',
    description: 'Barre de remorquage pour Airbus AS565 Panther avec système de cornes pour accrochage spécifique.',
    shortDescription: 'Barre Panther — Avec cornes',
    compatibility: ['AS565', 'SA365'],
    features: ['Système de cornes', 'Accrochage spécifique Panther', 'Conception militaire', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRE AW139 ══════
  {
    sku: 'BR-B139-01-000', slug: 'barre-remorquage-aw139-standard',
    name: 'Barre de Remorquage AW139 Leonardo — Standard',
    category: 'barres-remorquage',
    description: 'Barre de remorquage standard pour Leonardo AW139.',
    shortDescription: 'Barre standard AW139 Leonardo',
    compatibility: ['AW139'],
    features: ['Conception robuste', 'Compatible AW139', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ BARRE POLYVALENTE ══════
  {
    sku: 'BR-BHHL-01-000', slug: 'barre-polyvalente-helicopteres-patins',
    name: 'Barre Polyvalente — Hélicoptères à patins',
    category: 'barres-remorquage',
    description: 'Barre de remorquage polyvalente universelle pour hélicoptères à patins. Compatible avec de nombreux modèles.',
    shortDescription: 'Barre polyvalente universelle — Hélicoptères à patins',
    compatibility: ['H120', 'H125', 'H130', 'Gazelle'],
    features: ['Universelle hélicoptères à patins', 'Multi-compatible', 'Conception robuste', 'Fusibles de traction & torsion'],
    material: 'steel',
  },

  // ══════ OPTIONS BARRE POLYVALENTE ══════
  {
    sku: 'BR-BHHL-OP3', slug: 'option-barre-polyvalente-ballast-40kg',
    name: 'Option Barre Polyvalente — Ballast 40 kg',
    category: 'accessoires',
    description: 'Ballast de 40 kg pour barre polyvalente universelle. Améliore la stabilité lors du remorquage.',
    shortDescription: 'Ballast 40 kg — Stabilité améliorée',
    compatibility: ['H120', 'H125', 'H130', 'Gazelle'],
    features: ['Ballast 40 kg', 'Stabilité améliorée', 'Compatible barre polyvalente BR-BHHL-01-000'],
    material: 'steel',
  },
  {
    sku: 'BR-BHHL-OP4', slug: 'option-barre-polyvalente-support-rollers',
    name: 'Option Barre Polyvalente — Support fixe pour rollers',
    category: 'accessoires',
    description: 'Support fixe pour rollers compatible avec la barre polyvalente universelle.',
    shortDescription: 'Support fixe rollers — Compatible barre polyvalente',
    compatibility: ['H120', 'H125', 'H130', 'Gazelle'],
    features: ['Support fixe pour rollers', 'Compatible barre polyvalente BR-BHHL-01-000'],
    material: 'steel',
  },

  // ══════ ACCESSOIRES ══════
  {
    sku: 'BR-COO16-01-K01', slug: 'anneau-reduction-timon',
    name: 'Anneau de Réduction Timon',
    category: 'accessoires',
    description: 'Anneau de réduction pour timon. Permet l\'adaptation entre différents diamètres de timon.',
    shortDescription: 'Anneau de réduction timon — Adaptateur diamètres',
    compatibility: [],
    features: ['Réduction de diamètre timon', 'Adaptateur universel'],
    material: 'steel',
  },

  // ══════ ROLLERS HYDRAULIQUES ══════
  {
    sku: 'RL-R125-02-000', slug: 'roller-h125-hydraulique',
    name: 'Roller H125 — Hydraulique',
    category: 'rollers-manutention',
    description: 'Roller hydraulique pour Airbus H125. Système de levage hydraulique intégré pour manutention au sol.',
    shortDescription: 'Roller hydraulique H125',
    compatibility: ['H125'],
    features: ['Système hydraulique intégré', 'Levage contrôlé', 'Roues directionnelles'],
    material: 'steel',
  },
  {
    sku: 'RL-R130-02-000', slug: 'roller-h130-hydraulique',
    name: 'Roller H130 — Hydraulique',
    category: 'rollers-manutention',
    description: 'Roller hydraulique pour Airbus H130. Système de levage hydraulique intégré pour manutention au sol.',
    shortDescription: 'Roller hydraulique H130',
    compatibility: ['H130'],
    features: ['Système hydraulique intégré', 'Levage contrôlé', 'Roues directionnelles'],
    material: 'steel',
  },
  {
    sku: 'RL-RGAZ-02-000', slug: 'roller-gazelle-hydraulique',
    name: 'Roller Gazelle — Hydraulique',
    category: 'rollers-manutention',
    description: 'Roller hydraulique pour SA341/342 Gazelle. Système de levage hydraulique intégré.',
    shortDescription: 'Roller hydraulique Gazelle',
    compatibility: ['Gazelle'],
    features: ['Système hydraulique intégré', 'Compatible Gazelle SA341/342', 'Roues directionnelles'],
    material: 'steel',
  },
  {
    sku: 'RL-R125-03-000', slug: 'roller-ec120-h125-petites-roues-dart',
    name: 'Roller EC120/H125 — Petites roues, compatible panniers DART',
    category: 'rollers-manutention',
    description: 'Roller à petites roues pour EC120/H125, compatible avec les panniers DART. Conception compacte.',
    shortDescription: 'Roller EC120/H125 petites roues — Compatible DART',
    compatibility: ['H120', 'H125'],
    features: ['Petites roues', 'Compatible panniers DART', 'Conception compacte'],
    material: 'steel',
  },

  // ══════ ROLLER MÉCANIQUE ══════
  {
    sku: 'RL-R125-04-000', slug: 'roller-h125-mecanique',
    name: 'Roller H125 — Mécanique',
    category: 'rollers-manutention',
    description: 'Roller mécanique pour Airbus H125. Version mécanique sans hydraulique, actionnement manuel.',
    shortDescription: 'Roller mécanique H125 — Actionnement manuel',
    compatibility: ['H125'],
    features: ['Actionnement mécanique manuel', 'Sans hydraulique', 'Conception simplifiée', 'Roues directionnelles'],
    material: 'steel',
  },
]

// ─── GALLERY MAPPING (auto from SKU) ───
function getGallery(sku) {
  const folder = sku.toLowerCase()
  const basePath = `/images/gallery/${folder}`
  // main.webp is always the primary image
  return { image: `${basePath}/main.webp`, basePath }
}

async function main() {
  console.log('🔄 Synchronisation des produits vers Railway DB...\n')

  // 1. Ensure categories exist
  console.log('📁 Création/mise à jour des catégories...')
  const categoryMap = {}
  for (const cat of CATEGORIES) {
    const existing = await prisma.marketCategory.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label, description: cat.description, icon: cat.icon, order: cat.order },
      create: cat,
    })
    categoryMap[cat.slug] = existing.id
    console.log(`   ✅ ${cat.slug} → ${existing.id}`)
  }

  // 2. Delete ALL existing products + related records
  console.log('\n🗑️  Suppression des anciens produits...')
  const oldCount = await prisma.marketProduct.count()
  
  // Delete related records first
  await prisma.serialNumber.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.quoteItem.deleteMany({})
  await prisma.productDocument.deleteMany({})
  await prisma.marketProduct.deleteMany({})
  console.log(`   ✅ ${oldCount} anciens produits supprimés`)

  // 3. Insert all new products
  console.log(`\n📦 Insertion de ${PRODUCTS.length} nouveaux produits...`)
  for (const p of PRODUCTS) {
    const { image, basePath } = getGallery(p.sku)
    const categoryId = categoryMap[p.category]
    if (!categoryId) {
      console.error(`   ❌ Catégorie introuvable: ${p.category} pour ${p.sku}`)
      continue
    }

    const created = await prisma.marketProduct.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        categoryId,
        description: p.description,
        shortDescription: p.shortDescription,
        features: p.features || [],
        specs: {},
        image,
        gallery: [],
        priceDisplay: 'SUR DEVIS',
        compatibility: p.compatibility || [],
        usage: [],
        material: p.material || 'steel',
        inStock: true,
        minOrder: 1,
        leadTime: '4 à 8 semaines',
        warranty: '24 mois',
        isNew: false,
        isFeatured: false,
        published: true,
        certifications: [],
        standards: [],
        applications: [],
        boughtTogether: [],
      },
    })
    console.log(`   ✅ ${p.sku} — ${p.name} (${created.id})`)
  }

  // 4. Summary
  const finalCount = await prisma.marketProduct.count()
  console.log(`\n════════════════════════════════════════`)
  console.log(`✅ Synchronisation terminée: ${finalCount} produits en base`)
  console.log(`════════════════════════════════════════\n`)
}

main()
  .catch(e => { console.error('❌ Erreur:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
