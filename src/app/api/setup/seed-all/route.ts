import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// ── COMPANIES DATA ──
const COMPANIES = [
  {
    slug: 'mpeb',
    name: 'MPEB',
    tagline: 'Usinage de précision',
    description: `MPEB est spécialisée dans l'usinage de pièces complexes pour l'aéronautique. Notre expertise technique et nos équipements de pointe nous permettent de répondre aux exigences les plus strictes du secteur.\n\nFondée en 1989 par Gérard Lledo, MPEB est devenue une référence en usinage de précision pour l'industrie aéronautique et de défense.`,
    heroImage: '/images/societes/mpeb-hero.jpg',
    galleryImages: ['/images/societes/mpeb-1.jpg', '/images/societes/mpeb-2.jpg'],
    capabilities: { capacity: '100 000h/an', precision: '±0.01mm', machines: '25+ machines CNC' },
    expertise: ['Usinage 3, 4 et 5 axes', 'Tournage et fraisage', 'Alésage de précision', 'Surfaçage et rectification', 'Gravure laser', 'Contrôle dimensionnel'],
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
    description: `MGP est spécialisée dans la tôlerie fine et la chaudronnerie de précision. Intégrée au groupe LLEDO Industries en 2021, MGP apporte une expertise complémentaire en découpe laser, pliage et soudure.`,
    heroImage: '/images/societes/mgp-hero.jpg',
    galleryImages: ['/images/societes/mgp-1.jpg', '/images/societes/mgp-2.jpg'],
    capabilities: { capacity: '50 000h/an', precision: '±0.1mm', machines: 'Laser 6kW + Pliage 135T' },
    expertise: ['Découpe laser', 'Pliage CNC', 'Soudure TIG/MIG', 'Assemblage mécano-soudé', 'Traitement de surface', 'Peinture industrielle'],
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
    tagline: "Bureau d'études",
    description: `EGI est le bureau d'études du groupe LLEDO Industries. Créé en 2012, EGI accompagne nos clients de la conception à la réalisation de leurs projets industriels.`,
    heroImage: '/images/societes/egi-hero.jpg',
    galleryImages: ['/images/societes/egi-1.jpg', '/images/societes/egi-2.jpg'],
    capabilities: { capacity: '15 000h/an', precision: 'Modélisation 3D', machines: 'CATIA V5 / SolidWorks' },
    expertise: ['Conception mécanique', 'Modélisation 3D', 'Calcul de structure', 'Plans de fabrication', 'Études de faisabilité', 'Optimisation process'],
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
    description: `FREM assure la maintenance préventive et curative des équipements industriels. Créée en 2007, FREM intervient sur site pour garantir la disponibilité des moyens de production.`,
    heroImage: '/images/societes/frem-hero.jpg',
    galleryImages: ['/images/societes/frem-1.jpg', '/images/societes/frem-2.jpg'],
    capabilities: { capacity: '20 000h/an', precision: 'Intervention 24/7', machines: '3 camions atelier' },
    expertise: ['Maintenance préventive', 'Dépannage machines-outils', 'Installation équipements', 'Rénovation machines', 'Formation opérateurs', 'Contrats de maintenance'],
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

// ── JOBS DATA ──
const JOBS = [
  {
    title: 'Ingénieur Mécanique',
    slug: 'ingenieur-mecanique',
    type: 'CDI',
    location: 'Les Pennes-Mirabeau (13)',
    department: 'MPEB',
    salary: '40-50K€',
    description: "Nous recherchons un(e) Ingénieur Mécanique pour rejoindre notre équipe au sein de MPEB. Missions : conception et développement d'outillages aéronautiques, suivi de fabrication, interface clients/fournisseurs.",
    requirements: "Diplôme d'ingénieur en mécanique, 3-5 ans d'expérience, maîtrise CATIA V5/SolidWorks, connaissance normes EN 9100, anglais professionnel.",
    benefits: "CDI temps plein, rémunération attractive, mutuelle, tickets restaurant, formation continue.",
    published: true,
    featured: true,
  },
  {
    title: 'Technicien Usinage CNC',
    slug: 'technicien-usinage-cnc',
    type: 'CDI',
    location: 'Les Pennes-Mirabeau (13)',
    department: 'MPEB',
    salary: '30-38K€',
    description: "Nous recherchons un(e) Technicien Usinage pour renforcer notre équipe de production. Usinage de pièces de précision sur machines CNC 3, 4 et 5 axes.",
    requirements: "BTS/DUT en mécanique ou usinage, expérience usinage de précision, maîtrise programmation CN (Fanuc, Heidenhain).",
    published: true,
    featured: false,
  },
]

// ── BLOG DATA ──
const BLOG_POSTS = [
  {
    title: 'LLEDO Industries recrute : rejoignez notre équipe !',
    slug: 'lledo-industries-recrute',
    excerpt: "Découvrez nos opportunités de carrière et rejoignez une entreprise à taille humaine avec 36 ans d'expertise.",
    content: "Fort de 36 ans d'expérience dans l'industrie aéronautique, le groupe LLEDO Industries poursuit son développement et recherche de nouveaux talents. Consultez nos offres d'emploi et envoyez-nous votre candidature !",
    tags: ['recrutement', 'carrière', 'emploi'],
    published: true,
    featured: true,
    authorName: 'LLEDO Industries',
    publishedAt: new Date(),
  },
]

// ── MARKETPLACE CATEGORIES ──
const CATEGORIES = [
  { slug: 'barres-remorquage', label: 'Barres de remorquage', description: 'Solutions de tractage certifiées pour hélicoptères civils et militaires', icon: 'GitFork', order: 0 },
  { slug: 'rollers-manutention', label: 'Rollers & Manutention', description: 'Systèmes de levage et déplacement hydrauliques pour maintenance hangar', icon: 'Wrench', order: 1 },
  { slug: 'outillage-maintenance', label: 'Outillage de maintenance', description: 'Équipements spécialisés pour la maintenance aéronautique', icon: 'Settings', order: 2 },
  { slug: 'ground-support', label: 'Ground Support Equipment', description: 'Équipements de support au sol pour opérations aéroportuaires', icon: 'Truck', order: 3 },
]

// ── MARKETPLACE PRODUCTS ──
const PRODUCTS = [
  {"id":"BR-B160-01","slug":"barre-remorquage-h160-standard","name":"Barre de Remorquage H160 — Standard","category":"barres-remorquage","description":"Barre de remorquage standard à accrochage rapide pour Airbus H160.","shortDescription":"Barre standard H160 — Accrochage rapide mono-opérateur","features":["Système de verrouillage rapide double sécurité","Utilisation mono-opérateur","Commande de verrouillage déportée","Fusibles de traction & torsion","Amortisseur de timon","Hauteur réglable — 3 positions"],"specs":{"Compatibilité":"Airbus H160","Norme":"ISO 9667"},"image":"/images/products/towbar-h160.svg","compatibility":["H160"],"usage":["civil","offshore"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage sur piste et taxiway","Manœuvre en hangar de maintenance"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B160-02","slug":"barre-remorquage-h160-demontable","name":"Barre de Remorquage H160 — Démontable","category":"barres-remorquage","description":"Barre de remorquage démontable en 2 parties pour Airbus H160.","shortDescription":"Barre H160 démontable en 2 parties","features":["Démontable en 2 parties","Transport facilité","Verrouillage rapide double sécurité","Mono-opérateur","Fusibles de traction & torsion","Amortisseur de timon"],"specs":{"Compatibilité":"Airbus H160","Type":"Démontable","Norme":"ISO 9667"},"image":"/images/products/towbar-h160.svg","compatibility":["H160"],"usage":["civil","offshore"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage sur piste","Transport déployable"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B160-03","slug":"barre-remorquage-h160-repliable","name":"Barre de Remorquage H160 — Repliable","category":"barres-remorquage","description":"Barre de remorquage repliable pour Airbus H160.","shortDescription":"Barre H160 repliable — Encombrement réduit","features":["Repliable sans outillage","Encombrement réduit","Verrouillage rapide double sécurité","Mono-opérateur","Fusibles de traction & torsion","Amortisseur de timon"],"specs":{"Compatibilité":"Airbus H160","Type":"Repliable","Norme":"ISO 9667"},"image":"/images/products/towbar-h160.svg","compatibility":["H160"],"usage":["civil","offshore"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage sur piste","Transport repliable"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B160-04","slug":"barre-remorquage-h160-flyr","name":"Barre de Remorquage H160 — FLYR Normal","category":"barres-remorquage","description":"Barre FLYR pour Airbus H160. Compatible FLIR et perche de ravitaillement.","shortDescription":"Barre H160 FLYR — Compatible FLIR & perche","features":["Compatible FLIR & perche","Verrouillage rapide double sécurité","Mono-opérateur","Fusibles de traction & torsion","Amortisseur de timon"],"specs":{"Compatibilité":"Airbus H160 (FLYR)","Norme":"ISO 9667"},"image":"/images/products/towbar-h160.svg","compatibility":["H160"],"usage":["civil","military","offshore"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage H160 version FLYR"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-B160-05","slug":"barre-remorquage-h160-flyr-demontable","name":"Barre de Remorquage H160 — FLYR Démontable","category":"barres-remorquage","description":"Barre FLYR démontable en 2 parties pour Airbus H160.","shortDescription":"Barre H160 FLYR démontable en 2 parties","features":["Compatible FLIR & perche","Démontable en 2 parties","Verrouillage rapide","Mono-opérateur","Fusibles de traction & torsion"],"specs":{"Compatibilité":"Airbus H160 (FLYR)","Type":"Démontable","Norme":"ISO 9667"},"image":"/images/products/towbar-h160.svg","compatibility":["H160"],"usage":["civil","military","offshore"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage H160 FLYR","Transport déployable"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-B175-01","slug":"barre-remorquage-h145-standard","name":"Barre de Remorquage H145 — Standard","category":"barres-remorquage","description":"Barre de remorquage standard pour Airbus H145.","shortDescription":"Barre H145 standard — Commande à distance","features":["Accrochage rapide breveté","Mono-opérateur à distance","Commande déportée","Fusibles de traction & torsion","Amortisseur de timon","Hauteur réglable — 3 positions"],"specs":{"Compatibilité":"Airbus H145 / EC145","Norme":"ISO 9667"},"image":"/images/products/towbar-h145.svg","compatibility":["H145"],"usage":["civil","military","sar"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage sur piste","Opérations HEMS"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B330-01-000","slug":"barre-remorquage-puma-standard","name":"Barre de Remorquage Puma — Standard","category":"barres-remorquage","description":"Barre de remorquage pour SA330 Puma.","shortDescription":"Barre Puma standard — Civil & militaire","features":["Accrochage rapide breveté","Mono-opérateur","Commande déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"SA330 Puma","Longueur":"3666 mm","Poids":"60 kg","Norme":"ISO 9667"},"image":"/images/products/towbar-puma.svg","compatibility":["SA330"],"usage":["civil","military"],"material":"steel","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage sur piste","Manœuvre en hangar"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B332-01-000","slug":"barre-remorquage-super-puma-standard","name":"Barre de Remorquage Super Puma — Standard","category":"barres-remorquage","description":"Barre de remorquage pour AS332 Super Puma.","shortDescription":"Barre Super Puma standard — Hélicoptères lourds","features":["Accrochage rapide breveté","Mono-opérateur","Commande déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"AS332 Super Puma","Norme":"ISO 9667"},"image":"/images/products/towbar-puma.svg","compatibility":["AS332"],"usage":["civil","military","offshore"],"material":"steel","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage sur piste","Opérations offshore"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B332-03-000","slug":"barre-remorquage-super-puma-flyr","name":"Barre de Remorquage Super Puma — FLYR","category":"barres-remorquage","description":"Barre FLYR pour famille Super Puma. Compatible FLIR et perche.","shortDescription":"Barre Super Puma FLYR — Compatible FLIR & perche","features":["Compatible FLIR & perche","Accrochage rapide breveté","Mono-opérateur","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"AS332/AS532/EC225/EC725/H215/H225","Norme":"ISO 9667"},"image":"/images/products/towbar-puma.svg","compatibility":["AS332","AS532","H225","EC725","H215"],"usage":["military","offshore"],"material":"steel","inStock":true,"isNew":false,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage hélicoptères lourds famille Super Puma"],"leadTime":"8 à 12 semaines","warranty":"24 mois"},
  {"id":"BR-NH90-01-000","slug":"barre-remorquage-nh90-standard","name":"Barre de Remorquage NH90 — Standard","category":"barres-remorquage","description":"Barre de remorquage pour NH90 Caïman.","shortDescription":"Barre NH90 Caïman standard — Militaire & naval","features":["Accrochage rapide breveté","Mono-opérateur","Commande déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"NH90 TTH/NFH","Norme":"ISO 9667"},"image":"/images/products/towbar-nh90.svg","compatibility":["NH90"],"usage":["military","naval"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage militaire NH90","Tractage sur pont d'envol"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-NH90-02-000","slug":"barre-remorquage-nh90-courte","name":"Barre de Remorquage NH90 — Barre courte","category":"barres-remorquage","description":"Version courte de la barre NH90 pour espaces restreints.","shortDescription":"Barre NH90 courte — Espaces restreints","features":["Version courte compacte","Accrochage rapide breveté","Mono-opérateur","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"NH90 TTH/NFH","Longueur":"2336 mm","Poids":"55 kg","Norme":"ISO 9667"},"image":"/images/products/towbar-nh90.svg","compatibility":["NH90"],"usage":["military","naval"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage NH90 espace restreint","Pont d'envol"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-B365-01-000","slug":"barre-remorquage-dauphin-standard","name":"Barre de Remorquage Dauphin — Standard","category":"barres-remorquage","description":"Barre de remorquage pour SA365 Dauphin.","shortDescription":"Barre Dauphin standard — Accrochage rapide","features":["Accrochage rapide breveté","Mono-opérateur","Commande déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"SA365 Dauphin","Longueur":"2865 mm","Poids":"31 kg","Norme":"ISO 9667"},"image":"/images/products/towbar-dauphin.svg","compatibility":["SA365"],"usage":["civil","military"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage SA365 Dauphin"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-B365-02-000","slug":"barre-remorquage-panther-cornes","name":"Barre de Remorquage Panther — Avec cornes","category":"barres-remorquage","description":"Version militaire avec cornes pour AS565 Panther.","shortDescription":"Barre Panther avec cornes — Version militaire","features":["Version militaire avec cornes","Accrochage rapide breveté","Mono-opérateur","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon"],"specs":{"Compatibilité":"AS565 Panther","Longueur":"3057 mm","Poids":"32 kg","Norme":"ISO 9667"},"image":"/images/products/towbar-dauphin.svg","compatibility":["AS565"],"usage":["military","naval"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage AS565 Panther","Pont d'envol"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-B139-01-000","slug":"barre-remorquage-aw139-standard","name":"Barre de Remorquage AW139 — Standard","category":"barres-remorquage","description":"Barre de remorquage pour Leonardo AW139.","shortDescription":"Barre AW139 standard — Accrochage rapide","features":["Accrochage rapide breveté","Mono-opérateur","Commande déportée","Fusibles de traction & torsion","Hauteur réglable — 3 positions","Amortisseur de timon","Patins de protection jante"],"specs":{"Compatibilité":"Leonardo AW139","Longueur":"3634 mm","Poids":"60 kg","Norme":"ISO 9667"},"image":"/images/products/towbar-aw139.svg","compatibility":["AW139"],"usage":["civil","offshore","sar"],"material":"steel","inStock":true,"isNew":true,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage AW139","Opérations offshore","SAR"],"leadTime":"6 à 8 semaines","warranty":"24 mois"},
  {"id":"BR-BHHL-01-000","slug":"barre-polyvalente-helicopteres-patins","name":"Barre Polyvalente — Hélicoptères à Patins","category":"barres-remorquage","description":"Barre universelle pour hélicoptères légers à patins. Ultra-légère alu.","shortDescription":"Barre universelle hélicos à patins — Ultra-légère alu","features":["Polyvalente — tous hélicos légers à patins","Ultra-légère (aluminium)","Mono-opérateur","Amortisseur de timon","Fusibles de traction & torsion"],"specs":{"Compatibilité":"H120/H125/H130/H135/H145/SA341/SA342/AW109/AW119","Matériau":"Aluminium aéronautique","Norme":"ISO 9667"},"image":"/images/products/barre-bhhl.svg","compatibility":["H120","H125","H130","H135","H145","Gazelle","AW109","AW119"],"usage":["civil","military"],"material":"aluminium","inStock":true,"isNew":true,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Tractage hélicoptères légers à patins"],"leadTime":"8 à 10 semaines","warranty":"24 mois"},
  {"id":"BR-BHHL-OP3","slug":"option-ballast-40kg","name":"Option Barre Polyvalente — Ballast 40 kg","category":"barres-remorquage","description":"Contrepoids de sécurité 40 kg pour barre polyvalente.","shortDescription":"Ballast 40 kg — Contrepoids de sécurité","features":["Contrepoids 40 kg","Installation rapide"],"specs":{"Compatibilité":"BR-BHHL-01-000","Poids":"40 kg"},"image":"/images/products/barre-bhhl.svg","compatibility":["H120","H125","H130","H135","H145","Gazelle","AW109","AW119"],"usage":["civil","military"],"material":"steel","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE"],"standards":[],"applications":["Stabilisation tractage"],"leadTime":"2 à 4 semaines","warranty":"24 mois"},
  {"id":"BR-BHHL-OP4","slug":"option-support-fixe-rollers","name":"Option Barre Polyvalente — Support Fixe Rollers","category":"barres-remorquage","description":"Support fixe rollers sur barre polyvalente.","shortDescription":"Support fixe rollers — Fixation sur barre","features":["Fixation rollers sur barre","Compatible RL-R125/RL-R130","Installation rapide"],"specs":{"Compatibilité":"BR-BHHL-01-000 + Rollers"},"image":"/images/products/barre-bhhl.svg","compatibility":["H120","H125","H130","H135","H145","Gazelle","AW109","AW119"],"usage":["civil","military"],"material":"steel","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE"],"standards":[],"applications":["Fixation rollers sur barre"],"leadTime":"2 à 4 semaines","warranty":"24 mois"},
  {"id":"BR-COO16-01-K01","slug":"anneau-reduction-timon","name":"Anneau de Réduction Timon","category":"outillage-maintenance","description":"Anneau de réduction pour timon de barre de remorquage.","shortDescription":"Anneau réduction timon — Adaptation tracteur","features":["Réduction diamètre timon","Acier usiné","Adaptation universelle","Marquage LLEDO"],"specs":{"Type":"Anneau de réduction","Matériau":"Acier usiné"},"image":"/images/products/accessoire-timon.svg","compatibility":[],"usage":["civil","military"],"material":"steel","inStock":true,"isNew":false,"isFeatured":false,"certifications":[],"standards":[],"applications":["Adaptation timon"],"leadTime":"2 à 4 semaines","warranty":"24 mois"},
  {"id":"RL-R125-02-000","slug":"roller-h125-hydraulique","name":"Roller H125 — Hydraulique","category":"rollers-manutention","description":"Roller hydraulique breveté pour H125 / AS350 Écureuil.","shortDescription":"Roller H125 hydraulique — Pompe double vitesse","features":["Levage hydraulique","Pompe double vitesse","Utilisation debout","Frein de parc positif","Capot personnalisable"],"specs":{"Compatibilité":"H125 / AS350","Type":"Hydraulique","Norme":"ISO 9667"},"image":"/images/products/roller-h125.svg","compatibility":["H125"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Mise sur roues","Roulage piste"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-R130-02-000","slug":"roller-h130-hydraulique","name":"Roller H130 — Hydraulique","category":"rollers-manutention","description":"Roller hydraulique pour H130 / EC130.","shortDescription":"Roller H130 hydraulique — Géométrie EC130","features":["Levage hydraulique","Pompe double vitesse","Géométrie H130","Frein de parc positif","Capot personnalisable"],"specs":{"Compatibilité":"H130 / EC130","Type":"Hydraulique","Norme":"ISO 9667"},"image":"/images/products/roller-h130.svg","compatibility":["H130"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Mise sur roues"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-RGAZ-02-000","slug":"roller-gazelle-hydraulique","name":"Roller Gazelle — Hydraulique","category":"rollers-manutention","description":"Roller hydraulique pour SA341/342 Gazelle.","shortDescription":"Roller Gazelle hydraulique — Patins Gazelle","features":["Levage hydraulique","Pompe double vitesse","Patins Gazelle","Frein de parc positif"],"specs":{"Compatibilité":"SA341/SA342 Gazelle","Type":"Hydraulique","Norme":"ISO 9667"},"image":"/images/products/roller-gazelle.svg","compatibility":["Gazelle"],"usage":["civil","military"],"material":"steel-alu","inStock":true,"isNew":false,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Mise sur roues Gazelle"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-R125-03-000","slug":"roller-ec120-h125-petites-roues-dart","name":"Roller EC120/H125 — Petites Roues, Compatible DART","category":"rollers-manutention","description":"Roller petites roues pour EC120/H125, compatible panniers DART.","shortDescription":"Roller EC120/H125 petites roues — Compatible DART","features":["Petites roues compactes","Compatible panniers DART","Passage sous marchepied","Pompage au pied","Capot personnalisable"],"specs":{"Compatibilité":"EC120 / H125","Type":"Hydraulique — Petites roues","Compatible":"Panniers DART","Norme":"ISO 9667"},"image":"/images/products/roller-h125-petit.svg","compatibility":["H120","H125"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":true,"isFeatured":true,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Roulage piste","Compatible panniers DART"],"leadTime":"4 à 6 semaines","warranty":"24 mois"},
  {"id":"RL-R125-04-000","slug":"roller-h125-mecanique","name":"Roller H125 — Mécanique","category":"rollers-manutention","description":"Roller mécanique ultra-compact et démontable pour H125.","shortDescription":"Roller H125 mécanique — Ultra-compact, démontable","features":["Bras anti-retour sécurisé","Ultra-compact","Roues démontables","Démontable en 2 parties","Utilisation sous panier"],"specs":{"Compatibilité":"H125","Type":"Mécanique à bras","Poids":"19 kg","Encombrement":"412 x 363 x 308 mm","Norme":"ISO 9667"},"image":"/images/products/roller-mecanique.svg","compatibility":["H125"],"usage":["civil"],"material":"steel-alu","inStock":true,"isNew":true,"isFeatured":false,"certifications":["CE","Directive Machines 2006/42/CE"],"standards":["ISO 9667"],"applications":["Levage hélicoptères légers","Transport compact"],"leadTime":"4 à 6 semaines","warranty":"24 mois"}
]

// ══════════════════════════════════════════════
// GET /api/setup/seed-all — Initialize entire DB
// ══════════════════════════════════════════════
export async function GET(request: Request) {
  // Simple auth check via query param (change this secret)
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  if (key !== process.env.SEED_SECRET && key !== 'lledo-seed-2026') {
    return NextResponse.json({ error: 'Unauthorized. Pass ?key=YOUR_SEED_SECRET' }, { status: 401 })
  }

  const results: Record<string, string> = {}

  try {
    // ── 1. ADMIN USER ──
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lledo-industries.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'LLEDO',
        role: 'ADMIN',
        company: 'LLEDO Industries',
      },
    })
    results['admin'] = `✅ Admin user: ${adminEmail}`

    // ── 2. COMPANIES ──
    let companyCount = 0
    for (const company of COMPANIES) {
      await prisma.company.upsert({
        where: { slug: company.slug },
        update: { name: company.name, tagline: company.tagline },
        create: company,
      })
      companyCount++
    }
    results['companies'] = `✅ ${companyCount} companies`

    // ── 3. JOBS ──
    let jobCount = 0
    for (const job of JOBS) {
      await prisma.job.upsert({
        where: { slug: job.slug },
        update: job,
        create: job,
      })
      jobCount++
    }
    results['jobs'] = `✅ ${jobCount} jobs`

    // ── 4. BLOG ──
    let blogCount = 0
    for (const post of BLOG_POSTS) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: post,
        create: post,
      })
      blogCount++
    }
    results['blog'] = `✅ ${blogCount} blog posts`

    // ── 5. MARKETPLACE CATEGORIES ──
    const categoryMap = new Map<string, string>()
    for (const cat of CATEGORIES) {
      const created = await prisma.marketCategory.upsert({
        where: { slug: cat.slug },
        update: { label: cat.label, description: cat.description, icon: cat.icon, order: cat.order },
        create: cat,
      })
      categoryMap.set(cat.slug, created.id)
    }
    results['categories'] = `✅ ${CATEGORIES.length} marketplace categories`

    // ── 6. MARKETPLACE PRODUCTS ──
    let productCount = 0
    for (const p of PRODUCTS as any[]) {
      const categoryId = categoryMap.get(p.category)
      if (!categoryId) continue

      await prisma.marketProduct.upsert({
        where: { slug: p.slug },
        update: {
          name: p.name,
          sku: p.id,
          categoryId,
          description: p.description,
          shortDescription: p.shortDescription,
          features: p.features || [],
          specs: p.specs || {},
          image: p.image,
          gallery: [],
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
        create: {
          slug: p.slug,
          sku: p.id,
          name: p.name,
          categoryId,
          description: p.description,
          shortDescription: p.shortDescription,
          features: p.features || [],
          specs: p.specs || {},
          image: p.image,
          gallery: [],
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
      productCount++
    }
    results['products'] = `✅ ${productCount} marketplace products`

    // ── Summary ──
    const totalProducts = await prisma.marketProduct.count()
    const totalUsers = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      results,
      totals: {
        users: totalUsers,
        companies: companyCount,
        jobs: jobCount,
        blogPosts: blogCount,
        categories: CATEGORIES.length,
        products: totalProducts,
      }
    })
  } catch (error: any) {
    console.error('[SEED-ALL] Error:', error)
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 })
  }
}
