/**
 * LLEDO Aerotools — Seed REAL product catalog
 * Deletes ALL existing products, then inserts the official product list.
 *
 * Usage: npx tsx scripts/seed-real-catalog.ts
 */

import dotenv from 'dotenv'
import path from 'path'

// Load .env.local first, then .env as fallback
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const dbUrl = process.env.DATABASE_URL || ''
const masked = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')
console.log(`🔗 DATABASE_URL: ${masked}`)

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ════════════════════════════════════════════════════════
// CATEGORIES — slug → will be resolved to DB id at runtime
// ════════════════════════════════════════════════════════
const CAT_TOWING = 'barres-remorquage'
const CAT_HANDLING = 'rollers-manutention'
const CAT_MAINTENANCE = 'outillage-maintenance'

// ════════════════════════════════════════════════════════
// FULL PRODUCT CATALOG
// ════════════════════════════════════════════════════════

interface ProductSeed {
  sku: string
  slug: string
  name: string
  categorySlug: string
  description: string
  shortDescription: string
  features: string[]
  specs: Record<string, string>
  compatibility: string[]
  usage: string[]
  material: string
  image: string
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  leadTime: string
  certifications: string[]
  standards: string[]
  applications: string[]
}

const PRODUCTS: ProductSeed[] = [
  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — H160
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-B160-01',
    slug: 'barre-remorquage-h160-standard',
    name: 'Barre de Remorquage H160 — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage standard à accrochage rapide pour Airbus H160. Système de verrouillage double sécurité, utilisation mono-opérateur. Conception robuste certifiée ISO 9667.',
    shortDescription: 'Barre standard H160 — Accrochage rapide mono-opérateur',
    features: [
      'Système de verrouillage rapide double sécurité',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Amortisseur de timon',
      'Hauteur réglable — 3 positions',
    ],
    specs: { 'Compatibilité': 'Airbus H160', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H160'],
    usage: ['civil', 'offshore'],
    material: 'steel-alu',
    image: '/images/products/towbar-h160.svg',
    inStock: true, isNew: false, isFeatured: true,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage sur piste et taxiway', 'Manœuvre en hangar de maintenance', 'Positionnement précis sur aire de stationnement'],
  },
  {
    sku: 'BR-B160-02',
    slug: 'barre-remorquage-h160-demontable',
    name: 'Barre de Remorquage H160 — Démontable',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage démontable pour Airbus H160. Se sépare en deux parties pour faciliter le transport et le stockage. Mêmes performances que la version standard.',
    shortDescription: 'Barre H160 démontable en 2 parties — Transport facilité',
    features: [
      'Démontable en 2 parties',
      'Transport et stockage facilités',
      'Système de verrouillage rapide double sécurité',
      'Utilisation mono-opérateur',
      'Fusibles de traction & torsion',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'Airbus H160', 'Type': 'Démontable', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H160'],
    usage: ['civil', 'offshore'],
    material: 'steel-alu',
    image: '/images/products/towbar-h160.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage sur piste et taxiway', 'Transport déployable — repliable sans outillage'],
  },
  {
    sku: 'BR-B160-03',
    slug: 'barre-remorquage-h160-repliable',
    name: 'Barre de Remorquage H160 — Repliable',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage repliable pour Airbus H160. Conception articulée permettant un repliage compact sans outillage. Idéale pour les opérations nécessitant un encombrement réduit.',
    shortDescription: 'Barre H160 repliable — Encombrement réduit',
    features: [
      'Repliable pour transport aisé',
      'Encombrement réduit sans outillage',
      'Système de verrouillage rapide double sécurité',
      'Utilisation mono-opérateur',
      'Fusibles de traction & torsion',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'Airbus H160', 'Type': 'Repliable', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H160'],
    usage: ['civil', 'offshore'],
    material: 'steel-alu',
    image: '/images/products/towbar-h160.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage sur piste et taxiway', 'Transport déployable — repliable sans outillage'],
  },
  {
    sku: 'BR-B160-04',
    slug: 'barre-remorquage-h160-flyr',
    name: 'Barre de Remorquage H160 — FLYR Normal',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage FLYR pour Airbus H160. Version compatible avec les équipements FLIR et perche de ravitaillement. Conception robuste certifiée.',
    shortDescription: 'Barre H160 FLYR — Compatible FLIR & perche',
    features: [
      'Compatible FLIR & perche de ravitaillement',
      'Système de verrouillage rapide double sécurité',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'Airbus H160 (FLYR)', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H160'],
    usage: ['civil', 'military', 'offshore'],
    material: 'steel-alu',
    image: '/images/products/towbar-h160.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '8 à 10 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage H160 version FLYR', 'Opérations avec équipements optroniques'],
  },
  {
    sku: 'BR-B160-05',
    slug: 'barre-remorquage-h160-flyr-demontable',
    name: 'Barre de Remorquage H160 — FLYR Démontable',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage FLYR démontable en 2 parties pour Airbus H160. Combine la compatibilité FLIR/perche avec la facilité de transport de la version démontable.',
    shortDescription: 'Barre H160 FLYR démontable en 2 parties',
    features: [
      'Compatible FLIR & perche de ravitaillement',
      'Démontable en 2 parties',
      'Transport et stockage facilités',
      'Système de verrouillage rapide double sécurité',
      'Utilisation mono-opérateur',
      'Fusibles de traction & torsion',
    ],
    specs: { 'Compatibilité': 'Airbus H160 (FLYR)', 'Type': 'Démontable', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H160'],
    usage: ['civil', 'military', 'offshore'],
    material: 'steel-alu',
    image: '/images/products/towbar-h160.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '8 à 10 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage H160 version FLYR', 'Transport déployable — démontable sans outillage'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — H145
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-B175-01',
    slug: 'barre-remorquage-h145-standard',
    name: 'Barre de Remorquage H145 — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage standard à accrochage rapide pour Airbus H145. Utilisable à distance par un seul opérateur avec commande de verrouillage déportée.',
    shortDescription: 'Barre H145 standard — Commande à distance mono-opérateur',
    features: [
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur à distance',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Amortisseur de timon',
      'Hauteur réglable — 3 positions',
    ],
    specs: { 'Compatibilité': 'Airbus H145 / EC145', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H145'],
    usage: ['civil', 'military', 'sar'],
    material: 'steel-alu',
    image: '/images/products/towbar-h145.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage sur piste et taxiway', 'Manœuvre en hangar de maintenance', 'Opérations HEMS'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — AS330 PUMA
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-B330-01-000',
    slug: 'barre-remorquage-puma-standard',
    name: 'Barre de Remorquage Puma — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage brevetée à accrochage rapide pour SA330 Puma. Robuste et éprouvée en opérations civiles et militaires.',
    shortDescription: 'Barre Puma standard — Éprouvée civil & militaire',
    features: [
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'SA330 Puma', 'Longueur': '3666 mm', 'Ø de Roues': '160 mm', 'Poids': '60 kg', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['SA330'],
    usage: ['civil', 'military'],
    material: 'steel',
    image: '/images/products/towbar-puma.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage sur piste et taxiway', 'Manœuvre en hangar de maintenance'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — AS332 SUPER PUMA
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-B332-01-000',
    slug: 'barre-remorquage-super-puma-standard',
    name: 'Barre de Remorquage Super Puma — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage brevetée à accrochage rapide pour AS332 Super Puma. Conception robuste adaptée aux hélicoptères lourds.',
    shortDescription: 'Barre Super Puma standard — Hélicoptères lourds',
    features: [
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'AS332 Super Puma', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['AS332'],
    usage: ['civil', 'military', 'offshore'],
    material: 'steel',
    image: '/images/products/towbar-puma.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage sur piste et taxiway', 'Opérations offshore', 'Manœuvre en hangar de maintenance'],
  },
  {
    sku: 'BR-B332-03-000',
    slug: 'barre-remorquage-super-puma-flyr',
    name: 'Barre de Remorquage Super Puma — FLYR',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage FLYR pour AS332 Super Puma. Compatible avec les versions équipées FLIR et perche de ravitaillement. Adaptée AS332, AS532, EC225, EC725, H215, H225.',
    shortDescription: 'Barre Super Puma FLYR — Compatible FLIR & perche',
    features: [
      'Compatible FLIR & perche de ravitaillement',
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'AS332 / AS532 / EC225 / EC725 / H215 / H225', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['AS332', 'AS532', 'H225', 'EC725', 'H215'],
    usage: ['military', 'offshore'],
    material: 'steel',
    image: '/images/products/towbar-puma.svg',
    inStock: true, isNew: false, isFeatured: true,
    leadTime: '8 à 12 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage hélicoptères lourds famille Super Puma', 'Opérations militaires et offshore', 'Compatible FLIR & perche de ravitaillement'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — NH90 CAÏMAN
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-NH90-01-000',
    slug: 'barre-remorquage-nh90-standard',
    name: 'Barre de Remorquage NH90 — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage brevetée à accrochage rapide pour NH90 Caïman. Version standard longue pour tractage militaire et naval.',
    shortDescription: 'Barre NH90 Caïman standard — Militaire & naval',
    features: [
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'NH90 TTH/NFH', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['NH90'],
    usage: ['military', 'naval'],
    material: 'steel-alu',
    image: '/images/products/towbar-nh90.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '8 à 10 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage militaire NH90', 'Tractage sur pont d\'envol (frégate, BPC)', 'Manœuvre en hangar'],
  },
  {
    sku: 'BR-NH90-02-000',
    slug: 'barre-remorquage-nh90-courte',
    name: 'Barre de Remorquage NH90 — Barre courte',
    categorySlug: CAT_TOWING,
    description: 'Version courte de la barre de remorquage NH90. Plus compacte pour les espaces restreints, conservant toutes les fonctionnalités de sécurité et le système mono-opérateur.',
    shortDescription: 'Barre NH90 version courte — Espaces restreints',
    features: [
      'Version courte compacte',
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'NH90 TTH/NFH', 'Longueur': '2336 mm', 'Poids': '55 kg', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['NH90'],
    usage: ['military', 'naval'],
    material: 'steel-alu',
    image: '/images/products/towbar-nh90.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '8 à 10 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage NH90 en espace restreint', 'Tractage sur pont d\'envol (frégate, BPC)'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — AS365 DAUPHIN / PANTHER
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-B365-01-000',
    slug: 'barre-remorquage-dauphin-standard',
    name: 'Barre de Remorquage Dauphin — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage brevetée à accrochage rapide pour SA365 Dauphin. Utilisation mono-opérateur avec commande de verrouillage déportée et fusibles de sécurité.',
    shortDescription: 'Barre Dauphin standard — Accrochage rapide mono-opérateur',
    features: [
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'SA365 Dauphin', 'Longueur': '2865 mm', 'Ø de Roues': '160 mm', 'Poids': '31 kg', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['SA365'],
    usage: ['civil', 'military'],
    material: 'steel-alu',
    image: '/images/products/towbar-dauphin.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage SA365 Dauphin', 'Manœuvre en hangar de maintenance'],
  },
  {
    sku: 'BR-B365-02-000',
    slug: 'barre-remorquage-panther-cornes',
    name: 'Barre de Remorquage Panther — Avec cornes',
    categorySlug: CAT_TOWING,
    description: 'Version militaire avec cornes de la barre Dauphin pour AS565 Panther. Accrochage rapide mono-opérateur, fusibles de sécurité et hauteur réglable.',
    shortDescription: 'Barre Panther avec cornes — Version militaire',
    features: [
      'Version militaire avec cornes',
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
    ],
    specs: { 'Compatibilité': 'AS565 Panther', 'Longueur': '3057 mm', 'Ø de Roues': '125 mm', 'Poids': '32 kg', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['AS565'],
    usage: ['military', 'naval'],
    material: 'steel-alu',
    image: '/images/products/towbar-dauphin.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '8 à 10 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage AS565 Panther', 'Tractage sur pont d\'envol (frégate, BPC)'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRES DE REMORQUAGE — AW139 LEONARDO
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-B139-01-000',
    slug: 'barre-remorquage-aw139-standard',
    name: 'Barre de Remorquage AW139 — Standard',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage brevetée à accrochage rapide pour Leonardo AW139. Mono-opérateur avec fusibles de sécurité, hauteur réglable et amortisseur de timon.',
    shortDescription: 'Barre AW139 standard — Accrochage rapide mono-opérateur',
    features: [
      'Accrochage rapide breveté',
      'Utilisation mono-opérateur',
      'Commande de verrouillage déportée',
      'Fusibles de traction & torsion',
      'Hauteur réglable — 3 positions',
      'Amortisseur de timon',
      'Patins de protection jante',
    ],
    specs: { 'Compatibilité': 'Leonardo AW139', 'Longueur': '3634 mm', 'Ø de Roues': '160 mm', 'Poids': '60 kg', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['AW139'],
    usage: ['civil', 'offshore', 'sar'],
    material: 'steel',
    image: '/images/products/towbar-aw139.svg',
    inStock: true, isNew: true, isFeatured: true,
    leadTime: '6 à 8 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage AW139 sur piste et héliport', 'Opérations offshore', 'Recherche et sauvetage (SAR)', 'Transport VIP et HEMS'],
  },

  // ═══════════════════════════════════════════════════════
  // BARRE POLYVALENTE — HÉLICOPTÈRES À PATINS
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-BHHL-01-000',
    slug: 'barre-polyvalente-helicopteres-patins',
    name: 'Barre Polyvalente — Hélicoptères à Patins',
    categorySlug: CAT_TOWING,
    description: 'Barre de remorquage universelle pour hélicoptères légers à patins. Compatible H120, H125, H130, H135, H145, SA341/342 Gazelle, AW109, AW119. Ultra-légère en structure aluminium, mise en place par un seul opérateur.',
    shortDescription: 'Barre universelle hélicos à patins — Ultra-légère alu',
    features: [
      'Polyvalente — compatible tous hélicos légers à patins',
      'Ultra-légère (structure alu)',
      'Mise en place par un seul opérateur',
      'Amortisseur de timon',
      'Fusibles de traction & torsion',
      'Commande de verrouillage déportée',
    ],
    specs: { 'Compatibilité': 'H120 / H125 / H130 / H135 / H145 / SA341 / SA342 / AW109 / AW119', 'Matériau': 'Aluminium aéronautique', 'Norme': 'ISO 9667', 'Conformité': 'Directive Machine 2006/42/CE' },
    compatibility: ['H120', 'H125', 'H130', 'H135', 'H145', 'Gazelle', 'AW109', 'AW119'],
    usage: ['civil', 'military'],
    material: 'aluminium',
    image: '/images/products/barre-bhhl.svg',
    inStock: true, isNew: true, isFeatured: true,
    leadTime: '8 à 10 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Tractage tous hélicoptères légers à patins', 'Opérations hangar et piste', 'Compatible rollers RL-R125 / RL-R130', 'Environnement civil et militaire'],
  },

  // ═══════════════════════════════════════════════════════
  // OPTIONS — BARRE POLYVALENTE
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-BHHL-OP3',
    slug: 'option-ballast-40kg',
    name: 'Option Barre Polyvalente — Ballast 40 kg',
    categorySlug: CAT_TOWING,
    description: 'Contrepoids de sécurité de 40 kg pour la barre polyvalente BR-BHHL-01-000. Améliore la stabilité lors du tractage des hélicoptères légers à patins.',
    shortDescription: 'Ballast 40 kg — Contrepoids de sécurité barre polyvalente',
    features: [
      'Contrepoids de sécurité 40 kg',
      'Installation rapide sans outillage',
      'Compatible barre polyvalente BR-BHHL-01-000',
    ],
    specs: { 'Compatibilité': 'BR-BHHL-01-000', 'Poids': '40 kg', 'Type': 'Contrepoids de sécurité' },
    compatibility: ['H120', 'H125', 'H130', 'H135', 'H145', 'Gazelle', 'AW109', 'AW119'],
    usage: ['civil', 'military'],
    material: 'steel',
    image: '/images/products/barre-bhhl.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '2 à 4 semaines',
    certifications: ['CE'],
    standards: [],
    applications: ['Stabilisation tractage hélicoptères légers'],
  },
  {
    sku: 'BR-BHHL-OP4',
    slug: 'option-support-fixe-rollers',
    name: 'Option Barre Polyvalente — Support Fixe Rollers',
    categorySlug: CAT_TOWING,
    description: 'Support fixe pour rollers sur la barre polyvalente BR-BHHL-01-000. Permet la fixation des rollers hydrauliques ou mécaniques sur la barre de remorquage.',
    shortDescription: 'Support fixe rollers — Fixation sur barre polyvalente',
    features: [
      'Fixation des rollers sur la barre de remorquage',
      'Compatible rollers RL-R125 / RL-R130',
      'Installation rapide',
    ],
    specs: { 'Compatibilité': 'BR-BHHL-01-000 + Rollers RL-R125 / RL-R130', 'Type': 'Support de fixation' },
    compatibility: ['H120', 'H125', 'H130', 'H135', 'H145', 'Gazelle', 'AW109', 'AW119'],
    usage: ['civil', 'military'],
    material: 'steel',
    image: '/images/products/barre-bhhl.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '2 à 4 semaines',
    certifications: ['CE'],
    standards: [],
    applications: ['Fixation rollers sur barre polyvalente', 'Système combiné tractage + mise sur roues'],
  },

  // ═══════════════════════════════════════════════════════
  // ACCESSOIRES
  // ═══════════════════════════════════════════════════════
  {
    sku: 'BR-COO16-01-K01',
    slug: 'anneau-reduction-timon',
    name: 'Anneau de Réduction Timon',
    categorySlug: CAT_MAINTENANCE,
    description: 'Anneau de réduction pour timon de barre de remorquage. Adaptation universelle aux différents véhicules tracteurs. Usiné en acier avec marquage LLEDO Aero Tools.',
    shortDescription: 'Anneau réduction timon — Adaptation tracteur universelle',
    features: [
      'Réduction diamètre timon',
      'Usinage précision acier',
      'Adaptation universelle tracteurs',
      'Marquage LLEDO Aero Tools',
    ],
    specs: { 'Type': 'Anneau de réduction', 'Matériau': 'Acier usiné', 'Marquage': 'LLEDO Aero Tools' },
    compatibility: [],
    usage: ['civil', 'military'],
    material: 'steel',
    image: '/images/products/accessoire-timon.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '2 à 4 semaines',
    certifications: [],
    standards: [],
    applications: ['Adaptation timon barre de remorquage', 'Compatible tous véhicules tracteurs'],
  },

  // ═══════════════════════════════════════════════════════
  // ROLLERS — HYDRAULIQUES
  // ═══════════════════════════════════════════════════════
  {
    sku: 'RL-R125-02-000',
    slug: 'roller-h125-hydraulique',
    name: 'Roller H125 — Hydraulique',
    categorySlug: CAT_HANDLING,
    description: 'Roller hydraulique breveté pour hélicoptère Airbus H125 / AS350 Écureuil. Levage hydraulique avec pompe à double vitesse. Utilisation debout et pompage au pied pour une ergonomie optimale.',
    shortDescription: 'Roller H125 hydraulique — Levage pompe double vitesse',
    features: [
      'Levage hydraulique manuel',
      'Pompe à double vitesse',
      'Utilisation debout & pompage au pied',
      'Frein de parc positif',
      'Ergonomie améliorée — pénibilité réduite',
      'Couleur de capot personnalisable',
    ],
    specs: { 'Compatibilité': 'H125 / AS350 Écureuil', 'Type': 'Hydraulique', 'Norme': 'ISO 9667' },
    compatibility: ['H125'],
    usage: ['civil'],
    material: 'steel-alu',
    image: '/images/products/roller-h125.svg',
    inStock: true, isNew: false, isFeatured: true,
    leadTime: '4 à 6 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Mise sur roues pour maintenance hangar', 'Déplacement sur aire de stationnement', 'Roulage piste hélicoptères à patins'],
  },
  {
    sku: 'RL-R130-02-000',
    slug: 'roller-h130-hydraulique',
    name: 'Roller H130 — Hydraulique',
    categorySlug: CAT_HANDLING,
    description: 'Roller hydraulique breveté pour hélicoptère Airbus H130 / EC130. Levage hydraulique avec pompe à double vitesse, conception adaptée à la géométrie spécifique du H130.',
    shortDescription: 'Roller H130 hydraulique — Adapté géométrie EC130',
    features: [
      'Levage hydraulique manuel',
      'Pompe à double vitesse',
      'Utilisation debout & pompage au pied',
      'Frein de parc positif',
      'Adapté géométrie spécifique H130',
      'Couleur de capot personnalisable',
    ],
    specs: { 'Compatibilité': 'H130 / EC130', 'Type': 'Hydraulique', 'Norme': 'ISO 9667' },
    compatibility: ['H130'],
    usage: ['civil'],
    material: 'steel-alu',
    image: '/images/products/roller-h130.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '4 à 6 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Mise sur roues pour maintenance hangar', 'Déplacement sur aire de stationnement'],
  },
  {
    sku: 'RL-RGAZ-02-000',
    slug: 'roller-gazelle-hydraulique',
    name: 'Roller Gazelle — Hydraulique',
    categorySlug: CAT_HANDLING,
    description: 'Roller hydraulique breveté pour hélicoptère SA341/342 Gazelle. Levage hydraulique adapté à la géométrie des patins Gazelle.',
    shortDescription: 'Roller Gazelle hydraulique — Adapté patins Gazelle',
    features: [
      'Levage hydraulique manuel',
      'Pompe à double vitesse',
      'Adapté patins Gazelle',
      'Frein de parc positif',
      'Utilisation debout & pompage au pied',
    ],
    specs: { 'Compatibilité': 'SA341 / SA342 Gazelle', 'Type': 'Hydraulique', 'Norme': 'ISO 9667' },
    compatibility: ['Gazelle'],
    usage: ['civil', 'military'],
    material: 'steel-alu',
    image: '/images/products/roller-gazelle.svg',
    inStock: true, isNew: false, isFeatured: false,
    leadTime: '4 à 6 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Mise sur roues Gazelle', 'Déplacement en hangar', 'Opérations mono-opérateur'],
  },
  {
    sku: 'RL-R125-03-000',
    slug: 'roller-ec120-h125-petites-roues-dart',
    name: 'Roller EC120/H125 — Petites Roues, Compatible DART',
    categorySlug: CAT_HANDLING,
    description: 'Roller breveté version petites roues pour hélicoptères EC120 et H125. Format compact compatible panniers DART. Passage direct sous le marchepied sans rotation nécessaire.',
    shortDescription: 'Roller EC120/H125 petites roues — Compatible panniers DART',
    features: [
      'Petites roues — format compact',
      'Compatible panniers DART',
      'Passage direct sous marchepied sans rotation',
      'Utilisation debout & pompage au pied',
      'Format compact — stockage dans l\'appareil',
      'Couleur de capot personnalisable',
    ],
    specs: { 'Compatibilité': 'EC120 / H125', 'Type': 'Hydraulique — Petites roues', 'Compatible': 'Panniers DART', 'Norme': 'ISO 9667' },
    compatibility: ['H120', 'H125'],
    usage: ['civil'],
    material: 'steel-alu',
    image: '/images/products/roller-h125-petit.svg',
    inStock: true, isNew: true, isFeatured: true,
    leadTime: '4 à 6 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Roulage piste hélicoptères à patins', 'Stockage compact dans l\'appareil', 'Compatible panniers DART', 'Opérations mono-opérateur'],
  },

  // ═══════════════════════════════════════════════════════
  // ROLLERS — MÉCANIQUE
  // ═══════════════════════════════════════════════════════
  {
    sku: 'RL-R125-04-000',
    slug: 'roller-h125-mecanique',
    name: 'Roller H125 — Mécanique',
    categorySlug: CAT_HANDLING,
    description: 'Roller mécanique à bras breveté avec système sécurisé anti-retour. Ultra-compact et démontable en deux parties. Idéal pour levage et manutention des hélicoptères H125 et légers à patins.',
    shortDescription: 'Roller H125 mécanique — Ultra-compact, démontable, anti-retour',
    features: [
      'Barre démontable anti-retour sécurisé',
      'Ultra-compact — faible encombrement',
      'Roues démontables',
      'Barre démontable en deux parties',
      'Utilisation sous panier — espace restreint',
    ],
    specs: { 'Compatibilité': 'H125 / Hélicos légers à patins', 'Type': 'Mécanique à bras', 'Poids': '19 kg', 'Encombrement': '412 x 363 x 308 mm', 'Norme': 'ISO 9667' },
    compatibility: ['H125'],
    usage: ['civil'],
    material: 'steel-alu',
    image: '/images/products/roller-mecanique.svg',
    inStock: true, isNew: true, isFeatured: false,
    leadTime: '4 à 6 semaines',
    certifications: ['CE', 'Directive Machines 2006/42/CE'],
    standards: ['ISO 9667'],
    applications: ['Levage et manutention hélicoptères légers', 'Utilisation sous panier — espace restreint', 'Transport et stockage compact'],
  },
]

// ════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════

async function main() {
  console.log('\n══════════════════════════════════════════════')
  console.log('  LLEDO Aerotools — Seed REAL Product Catalog')
  console.log('══════════════════════════════════════════════\n')

  // ── 1. Get categories ──
  console.log('📦 Loading categories...')
  const categories = await prisma.marketCategory.findMany()
  const catMap = new Map(categories.map(c => [c.slug, c.id]))

  Array.from(catMap.entries()).forEach(([slug, id]) => {
    console.log(`  ✅ ${slug} → ${id}`)
  })

  // Verify all needed categories exist
  const neededSlugs = Array.from(new Set(PRODUCTS.map(p => p.categorySlug)))
  for (const slug of neededSlugs) {
    if (!catMap.has(slug)) {
      console.error(`  ❌ Missing category: ${slug}`)
      process.exit(1)
    }
  }

  // ── 2. Delete ALL existing products (and related records) ──
  console.log('\n🗑️  Deleting ALL existing products...')

  const existingCount = await prisma.marketProduct.count()
  console.log(`  Found ${existingCount} products to delete`)

  // Delete in correct order (foreign keys)
  const deletedSerials = await prisma.serialNumber.deleteMany()
  console.log(`  Deleted ${deletedSerials.count} serial numbers`)

  const deletedOrderItems = await prisma.orderItem.deleteMany()
  console.log(`  Deleted ${deletedOrderItems.count} order items`)

  const deletedQuoteItems = await prisma.quoteItem.deleteMany()
  console.log(`  Deleted ${deletedQuoteItems.count} quote items`)

  const deletedDocs = await prisma.productDocument.deleteMany()
  console.log(`  Deleted ${deletedDocs.count} product documents`)

  const deletedProducts = await prisma.marketProduct.deleteMany()
  console.log(`  ✅ Deleted ${deletedProducts.count} products`)

  // ── 3. Create all new products ──
  console.log(`\n🔧 Creating ${PRODUCTS.length} products...`)

  for (const p of PRODUCTS) {
    const categoryId = catMap.get(p.categorySlug)!

    const product = await prisma.marketProduct.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        categoryId,
        description: p.description,
        shortDescription: p.shortDescription,
        features: p.features,
        specs: p.specs,
        image: p.image,
        gallery: [],
        priceDisplay: 'SUR DEVIS',
        compatibility: p.compatibility,
        usage: p.usage,
        material: p.material,
        inStock: p.inStock,
        stockQuantity: p.inStock ? 10 : 0,
        minOrder: 1,
        leadTime: p.leadTime,
        warranty: '24 mois',
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        published: true,
        certifications: p.certifications,
        standards: p.standards,
        applications: p.applications,
        boughtTogether: [],
      },
    })

    console.log(`  ✅ ${product.sku} — ${product.name}`)
  }

  // ── 4. Summary ──
  const finalCount = await prisma.marketProduct.count()
  const towingCount = await prisma.marketProduct.count({ where: { category: { slug: CAT_TOWING } } })
  const handlingCount = await prisma.marketProduct.count({ where: { category: { slug: CAT_HANDLING } } })
  const maintenanceCount = await prisma.marketProduct.count({ where: { category: { slug: CAT_MAINTENANCE } } })

  console.log('\n══════════════════════════════════════════════')
  console.log('✅ Seed complete!')
  console.log(`   🔧 ${finalCount} produits au total`)
  console.log(`   🚜 ${towingCount} barres de remorquage`)
  console.log(`   🔄 ${handlingCount} rollers`)
  console.log(`   🔩 ${maintenanceCount} accessoires / maintenance`)
  console.log('══════════════════════════════════════════════\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
