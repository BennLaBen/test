import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const CATEGORIES = [
  { slug: 'barres-remorquage', label: 'Barres de remorquage', description: 'Solutions de tractage certifiées pour hélicoptères civils et militaires', icon: 'GitFork', order: 0 },
  { slug: 'rollers-manutention', label: 'Rollers & Manutention', description: 'Systèmes de levage et déplacement hydrauliques pour maintenance hangar', icon: 'Wrench', order: 1 },
  { slug: 'outillage-maintenance', label: 'Outillage de maintenance', description: 'Équipements spécialisés pour la maintenance aéronautique', icon: 'Settings', order: 2 },
  { slug: 'ground-support', label: 'Ground Support Equipment', description: 'Équipements de support au sol pour opérations aéroportuaires', icon: 'Truck', order: 3 },
]

const PRODUCTS = [
  {"id":"BR-B160-01","slug":"barre-remorquage-h160-standard","name":"Barre de Remorquage H160 — Standard","category":"barres-remorquage","description":"Barre de remorquage standard à accrochage rapide pour Airbus H160. Système de verrouillage double sécurité, utilisation mono-opérateur.","shortDescription":"Barre standard H160 — Accrochage rapide mono-opérateur","features":["Système de verrouillage rapide double sécurité","Utilisation mono-opérateur","Commande de verrouillage déportée","Fusibles de traction & torsion","Amortisseur de timon","Hauteur réglable — 3 positions"],"specs":{"Compatibilité":"Airbus H160","Norme":"ISO 9667","Conformité":"Directive Machine 2006/42/CE"},"image":"/images/gallery/.webp"],"compatibility":["NH90"],"usage":["military","naval"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage militaire NH90","Tractage sur pont d'envol"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-NH90-02-000","slug":"barre-remorquage-nh90-courte","name":"Barre de Remorquage NH90 — Barre courte","category":"barres-remorquage","description":"Version courte de la barre NH90. Plus compacte pour les espaces restreints.","shortDescription":"Barre NH90 version courte — Espaces restreints","features":["Version courte compacte","Accrochage rapide breveté","Utilisation mono-opérateur","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"NH90 TTH/NFH","Longueur":"2336 mm","Poids":"55 kg","Norme":"ISO 9667"},"image":"/images/gallery/.webp"],"compatibility":["NH90"],"usage":["military","naval"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage NH90 en espace restreint","Tractage sur pont d'envol"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-B365-01-000","slug":"barre-remorquage-dauphin-standard","name":"Barre de Remorquage Dauphin — Standard","category":"barres-remorquage","description":"Barre de remorquage brevetée pour SA365 Dauphin. Mono-opérateur avec commande de verrouillage déportée.","shortDescription":"Barre Dauphin standard — Accrochage rapide mono-opérateur","features":["Accrochage rapide breveté","Utilisation mono-opérateur","Commande de verrouillage déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"SA365 Dauphin","Longueur":"2865 mm","Poids":"31 kg","Norme":"ISO 9667"},"image":"/images/gallery/.webp"],"compatibility":["AS565"],"usage":["military","naval"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage AS565 Panther","Tractage sur pont d'envol"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-B139-01-000","slug":"barre-remorquage-aw139-standard","name":"Barre de Remorquage AW139 — Standard","category":"barres-remorquage","description":"Barre de remorquage brevetée pour Leonardo AW139. Mono-opérateur avec fusibles de sécurité.","shortDescription":"Barre AW139 standard — Accrochage rapide mono-opérateur","features":["Accrochage rapide breveté","Utilisation mono-opérateur","Commande de verrouillage déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon","Patins de protection jante"],"specs":{"Compatibilité":"Leonardo AW139","Longueur":"3634 mm","Poids":"60 kg","Norme":"ISO 9667"},"image":"/images/gallery/.webp"],"compatibility":[],"usage":["civil","military"],"material":"steel","inStock":true,"isNew":false,"isFeatured":false,"certifications":[],"standards":[],"applications":["Adaptation timon barre de remorquage"],"leadTime":"2 à 4 semaines","warranty":"24 mois"},
  {"id":"RL-R125-02-000","slug":"roller-h125-hydraulique","name":"Roller H125 — Hydraulique","category":"rollers-manutention","description":"Roller hydraulique breveté pour hélicoptère Airbus H125 / AS350 Écureuil. Levage hydraulique avec pompe à double vitesse.","shortDescription":"Roller H125 hydraulique — Levage pompe double vitesse","features":["Levage hydraulique manuel","Pompe à double vitesse","Utilisation debout & pompage au pied","Frein de parc positif","Couleur de capot personnalisable"],"specs":{"Compatibilité":"H125 / AS350 Écureuil","Type":"Hydraulique","Norme":"ISO 9667"},"image":"/images/products/roller-h125.svg","compatibility":["H125"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Mise sur roues pour maintenance hangar","Roulage piste hélicoptères à patins"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-R130-02-000","slug":"roller-h130-hydraulique","name":"Roller H130 — Hydraulique","category":"rollers-manutention","description":"Roller hydraulique breveté pour hélicoptère Airbus H130 / EC130. Adapté à la géométrie spécifique du H130.","shortDescription":"Roller H130 hydraulique — Adapté géométrie EC130","features":["Levage hydraulique manuel","Pompe à double vitesse","Adapté géométrie spécifique H130","Frein de parc positif","Couleur de capot personnalisable"],"specs":{"Compatibilité":"H130 / EC130","Type":"Hydraulique","Norme":"ISO 9667"},"image":"/images/products/roller-h130.svg","compatibility":["H130"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Mise sur roues pour maintenance hangar"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-RGAZ-02-000","slug":"roller-gazelle-hydraulique","name":"Roller Gazelle — Hydraulique","category":"rollers-manutention","description":"Roller hydraulique breveté pour hélicoptère SA341/342 Gazelle. Adapté à la géométrie des patins Gazelle.","shortDescription":"Roller Gazelle hydraulique — Adapté patins Gazelle","features":["Levage hydraulique manuel","Pompe à double vitesse","Adapté patins Gazelle","Frein de parc positif"],"specs":{"Compatibilité":"SA341/SA342 Gazelle","Type":"Hydraulique","Norme":"ISO 9667"},"image":"/images/products/roller-gazelle.svg","compatibility":["Gazelle"],"usage":["civil","military"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Mise sur roues Gazelle","Déplacement en hangar"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-R125-03-000","slug":"roller-ec120-h125-petites-roues-dart","name":"Roller EC120/H125 — Petites Roues, Compatible DART","category":"rollers-manutention","description":"Roller breveté version petites roues pour EC120 et H125. Format compact compatible panniers DART.","shortDescription":"Roller EC120/H125 petites roues — Compatible panniers DART","features":["Petites roues — format compact","Compatible panniers DART","Passage direct sous marchepied","Utilisation debout & pompage au pied","Couleur de capot personnalisable"],"specs":{"Compatibilité":"EC120 / H125","Type":"Hydraulique — Petites roues","Compatible":"Panniers DART","Norme":"ISO 9667"},"image":"/images/products/roller-h125-petit.svg","compatibility":["H120","H125"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":true,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Roulage piste","Stockage compact dans l'appareil","Compatible panniers DART"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-R125-04-000","slug":"roller-h125-mecanique","name":"Roller H125 — Mécanique","category":"rollers-manutention","description":"Roller mécanique à bras breveté avec système anti-retour. Ultra-compact et démontable en deux parties.","shortDescription":"Roller H125 mécanique — Ultra-compact, démontable, anti-retour","features":["Barre démontable anti-retour sécurisé","Ultra-compact — faible encombrement","Roues démontables","Barre démontable en deux parties","Utilisation sous panier — espace restreint"],"specs":{"Compatibilité":"H125","Type":"Mécanique à bras","Poids":"19 kg","Encombrement":"412 x 363 x 308 mm","Norme":"ISO 9667"},"image":"/images/products/roller-mecanique.svg","compatibility":["H125"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":true,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Levage hélicoptères légers","Utilisation sous panier","Transport compact"],"leadTime":"4 à 6 semaines","warranty":"24 mois"}
]

// GET /api/v2/migrate/seed-marketplace — Seed all 23 products into the DB
export async function GET() {
  try {
    // 1. Delete existing products + categories
    await prisma.productDocument.deleteMany({})
    await prisma.serialNumber.deleteMany({})
    await prisma.quoteItem.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.marketProduct.deleteMany({})
    await prisma.marketCategory.deleteMany({})

    // 2. Create categories
    const categoryMap = new Map<string, string>()
    for (const cat of CATEGORIES) {
      const created = await prisma.marketCategory.upsert({
        where: { slug: cat.slug },
        update: { label: cat.label, description: cat.description, icon: cat.icon, order: cat.order },
        create: cat,
      })
      categoryMap.set(cat.slug, created.id)
    }

    // 3. Create products
    let count = 0
    for (const p of PRODUCTS) {
      const categoryId = categoryMap.get(p.category)
      if (!categoryId) continue

      await prisma.marketProduct.create({
        data: {
          slug: p.slug,
          sku: p.id,
          name: p.name,
          categoryId,
          description: p.description,
          shortDescription: p.shortDescription,
          features: p.features || [],
          specs: p.specs || {},
          image: p.image,
          gallery: (p as any).gallery || [],
          priceDisplay: 'SUR DEVIS',
          compatibility: p.compatibility || [],
          usage: p.usage || [],
          material: p.material || '',
          inStock: p.inStock ?? true,
          stockQuantity: p.inStock ? 10 : 0,
          minOrder: 1,
          leadTime: p.leadTime || null,
          warranty: p.warranty || null,
          isNew: p.isNew ?? false,
          isFeatured: p.isFeatured ?? false,
          published: true,
          certifications: p.certifications || [],
          standards: p.standards || [],
          applications: p.applications || [],
        },
      })
      count++
    }

    const totalProducts = await prisma.marketProduct.count()
    const totalCategories = await prisma.marketCategory.count()

    return NextResponse.json({
      success: true,
      message: `Seed terminé: ${totalCategories} catégories, ${totalProducts} produits créés`,
      categories: totalCategories,
      products: totalProducts,
    })
  } catch (error: any) {
    console.error('[SEED] Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
