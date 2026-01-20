/**
 * Seed script: Initialize company data for MPEB, MGP, EGI, FREM
 * Run with: npx tsx prisma/seed-companies.ts
 */

import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://lledo:lledo_secret_2024@localhost:5433/lledo_db'
}

const prisma = new PrismaClient()

const companies = [
  {
    slug: 'mpeb',
    name: 'MPEB',
    tagline: 'Usinage de précision',
    description: `MPEB est spécialisée dans l'usinage de pièces complexes pour l'aéronautique. Notre expertise technique et nos équipements de pointe nous permettent de répondre aux exigences les plus strictes du secteur.

Fondée en 1989 par Gérard Lledo, MPEB est devenue une référence en usinage de précision pour l'industrie aéronautique et de défense. Avec plus de 30 machines à commande numérique et une équipe de techniciens hautement qualifiés, nous produisons des pièces de haute précision pour les plus grands donneurs d'ordres.`,
    heroImage: '/images/societes/mpeb-hero.jpg',
    galleryImages: ['/images/societes/mpeb-1.jpg', '/images/societes/mpeb-2.jpg'],
    capabilities: {
      capacity: '100 000h/an',
      precision: '±0.01mm',
      machines: '25+ machines CNC'
    },
    expertise: [
      'Usinage 3, 4 et 5 axes',
      'Tournage et fraisage',
      'Alésage de précision',
      'Surfaçage et rectification',
      'Gravure laser',
      'Contrôle dimensionnel'
    ],
    certifications: ['EN 9100', 'ISO 9001', 'NADCAP'],
    stats: [
      { label: "Années d'expérience", value: '36+', icon: 'TrendingUp', color: 'from-blue-500 to-blue-600' },
      { label: 'Pièces produites/an', value: '10k+', icon: 'Factory', color: 'from-purple-500 to-purple-600' },
      { label: 'Collaborateurs', value: '+100', icon: 'Users', color: 'from-green-500 to-green-600' },
      { label: 'Taux de conformité', value: '99.8%', icon: 'Target', color: 'from-amber-500 to-amber-600' }
    ],
    order: 1,
  },
  {
    slug: 'mgp',
    name: 'MGP',
    tagline: 'Tôlerie & Chaudronnerie',
    description: `MGP (Mécanique Générale de Précision) est spécialisée dans la tôlerie fine et la chaudronnerie de précision. Intégrée au groupe LLEDO Industries en 2021, MGP apporte une expertise complémentaire en découpe laser, pliage et soudure.

Notre atelier de 2000 m² est équipé de machines de dernière génération pour répondre aux demandes les plus exigeantes en matière de tôlerie industrielle.`,
    heroImage: '/images/societes/mgp-hero.jpg',
    galleryImages: ['/images/societes/mgp-1.jpg', '/images/societes/mgp-2.jpg'],
    capabilities: {
      capacity: '50 000h/an',
      precision: '±0.1mm',
      machines: 'Laser 6kW + Pliage 135T'
    },
    expertise: [
      'Découpe laser',
      'Pliage CNC',
      'Soudure TIG/MIG',
      'Assemblage mécano-soudé',
      'Traitement de surface',
      'Peinture industrielle'
    ],
    certifications: ['ISO 9001', 'EN 1090'],
    stats: [
      { label: "Années d'expérience", value: '25+', icon: 'TrendingUp', color: 'from-blue-500 to-blue-600' },
      { label: 'Surface atelier', value: '2000m²', icon: 'Factory', color: 'from-purple-500 to-purple-600' },
      { label: 'Soudeurs qualifiés', value: '8', icon: 'Users', color: 'from-green-500 to-green-600' },
      { label: 'Épaisseur max', value: '20mm', icon: 'Target', color: 'from-amber-500 to-amber-600' }
    ],
    order: 2,
  },
  {
    slug: 'egi',
    name: 'EGI',
    tagline: 'Bureau d\'études',
    description: `EGI (Études et Gestion Industrielle) est le bureau d'études du groupe LLEDO Industries. Créé en 2012, EGI accompagne nos clients de la conception à la réalisation de leurs projets industriels.

Notre équipe d'ingénieurs et de dessinateurs-projeteurs utilise les derniers outils de CAO/DAO pour concevoir des solutions sur mesure.`,
    heroImage: '/images/societes/egi-hero.jpg',
    galleryImages: ['/images/societes/egi-1.jpg', '/images/societes/egi-2.jpg'],
    capabilities: {
      capacity: '15 000h/an',
      precision: 'Modélisation 3D',
      machines: 'CATIA V5 / SolidWorks'
    },
    expertise: [
      'Conception mécanique',
      'Modélisation 3D',
      'Calcul de structure',
      'Plans de fabrication',
      'Études de faisabilité',
      'Optimisation process'
    ],
    certifications: ['ISO 9001'],
    stats: [
      { label: "Années d'expérience", value: '12+', icon: 'TrendingUp', color: 'from-blue-500 to-blue-600' },
      { label: 'Projets réalisés', value: '500+', icon: 'Factory', color: 'from-purple-500 to-purple-600' },
      { label: 'Ingénieurs', value: '5', icon: 'Users', color: 'from-green-500 to-green-600' },
      { label: 'Taux satisfaction', value: '98%', icon: 'Target', color: 'from-amber-500 to-amber-600' }
    ],
    order: 3,
  },
  {
    slug: 'frem',
    name: 'FREM',
    tagline: 'Maintenance industrielle',
    description: `FREM (Formation Réparation Entretien Mécanique) assure la maintenance préventive et curative des équipements industriels. Créée en 2007, FREM intervient sur site pour garantir la disponibilité des moyens de production de nos clients.

Nos techniciens interviennent sur tout type de machines-outils et équipements industriels.`,
    heroImage: '/images/societes/frem-hero.jpg',
    galleryImages: ['/images/societes/frem-1.jpg', '/images/societes/frem-2.jpg'],
    capabilities: {
      capacity: '20 000h/an',
      precision: 'Intervention 24/7',
      machines: '3 camions atelier'
    },
    expertise: [
      'Maintenance préventive',
      'Dépannage machines-outils',
      'Installation équipements',
      'Rénovation machines',
      'Formation opérateurs',
      'Contrats de maintenance'
    ],
    certifications: ['ISO 9001'],
    stats: [
      { label: "Années d'expérience", value: '17+', icon: 'TrendingUp', color: 'from-blue-500 to-blue-600' },
      { label: 'Interventions/an', value: '800+', icon: 'Factory', color: 'from-purple-500 to-purple-600' },
      { label: 'Techniciens', value: '6', icon: 'Users', color: 'from-green-500 to-green-600' },
      { label: 'Délai intervention', value: '<24h', icon: 'Target', color: 'from-amber-500 to-amber-600' }
    ],
    order: 4,
  },
]

async function seedCompanies() {
  console.log('🏢 Seeding companies...\n')

  for (const company of companies) {
    try {
      const existing = await prisma.company.findUnique({
        where: { slug: company.slug }
      })

      if (existing) {
        console.log(`⏭️  Skipping ${company.name} (already exists)`)
        continue
      }

      await prisma.company.create({
        data: company
      })

      console.log(`✅ Created: ${company.name}`)
    } catch (error) {
      console.error(`❌ Error creating ${company.name}:`, error)
    }
  }

  console.log('\n✅ Companies seeding complete!')
  await prisma.$disconnect()
}

seedCompanies()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
