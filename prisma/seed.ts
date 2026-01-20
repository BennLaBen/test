import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lledo-industries.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'

  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.upsert({
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

  console.log(`✅ Admin user created: ${admin.email}`)

  // Create sample jobs
  const jobs = [
    {
      title: 'Ingénieur Mécanique',
      slug: 'ingenieur-mecanique',
      type: 'CDI',
      location: 'Les Pennes-Mirabeau (13)',
      department: 'MPEB',
      salary: '40-50K€',
      description: `
## À propos du poste

Nous recherchons un(e) Ingénieur Mécanique pour rejoindre notre équipe au sein de MPEB, cœur historique du groupe LLEDO Industries.

## Missions principales

- Conception et développement d'outillages aéronautiques
- Réalisation de plans et documents techniques
- Suivi de fabrication et contrôle qualité
- Interface avec les clients et fournisseurs
- Participation aux projets R&D

## Environnement technique

- CATIA V5 / SolidWorks
- Usinage 3, 4 et 5 axes
- Matériaux aéronautiques (aluminium, titane, inox)
      `.trim(),
      requirements: `
## Profil recherché

- Diplôme d'ingénieur en mécanique ou équivalent
- 3 à 5 ans d'expérience en conception mécanique
- Maîtrise de CATIA V5 et/ou SolidWorks
- Connaissance des normes aéronautiques (EN 9100)
- Anglais professionnel

## Qualités attendues

- Rigueur et précision
- Esprit d'équipe
- Capacité d'adaptation
- Sens du service client
      `.trim(),
      benefits: `
## Ce que nous offrons

- CDI temps plein
- Rémunération attractive selon profil
- Mutuelle d'entreprise
- Tickets restaurant
- Formation continue
- Environnement technique stimulant
      `.trim(),
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
      description: `
## À propos du poste

Nous recherchons un(e) Technicien Usinage pour renforcer notre équipe de production.

## Missions principales

- Usinage de pièces de précision sur machines CNC 3, 4 et 5 axes
- Réglage et programmation des machines
- Contrôle dimensionnel des pièces
- Maintenance de premier niveau
      `.trim(),
      requirements: `
## Profil recherché

- BTS/DUT en mécanique ou usinage
- Expérience en usinage de précision
- Maîtrise de la programmation CN (Fanuc, Heidenhain)
- Lecture de plans techniques
      `.trim(),
      benefits: `
## Ce que nous offrons

- CDI temps plein
- Horaires de journée
- Mutuelle et prévoyance
- Formation sur nos équipements
      `.trim(),
      published: true,
      featured: false,
    },
    {
      title: 'Chaudronnier Soudeur',
      slug: 'chaudronnier-soudeur',
      type: 'CDI',
      location: 'Saint-Bauzille-de-Putois (34)',
      department: 'MGP',
      salary: '28-35K€',
      description: `
## À propos du poste

MGP recherche un(e) Chaudronnier Soudeur expérimenté(e) pour son site de production.

## Missions principales

- Travaux de chaudronnerie et tôlerie
- Soudure TIG, MIG, ARC
- Lecture de plans et traçage
- Assemblage d'ensembles mécaniques
      `.trim(),
      requirements: `
## Profil recherché

- CAP/BEP ou Bac Pro Chaudronnerie
- Expérience significative en chaudronnerie
- Certifications soudure appréciées
- Autonomie et rigueur
      `.trim(),
      published: true,
      featured: false,
    },
  ]

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: job,
      create: job,
    })
  }

  console.log(`✅ ${jobs.length} jobs created`)

  // Create sample blog posts
  const posts = [
    {
      title: 'LLEDO Industries recrute : rejoignez notre équipe !',
      slug: 'lledo-industries-recrute',
      excerpt: 'Découvrez nos opportunités de carrière et rejoignez une entreprise à taille humaine avec 36 ans d\'expertise.',
      content: `
# LLEDO Industries recrute

Fort de 36 ans d'expérience dans l'industrie aéronautique, le groupe LLEDO Industries poursuit son développement et recherche de nouveaux talents.

## Pourquoi nous rejoindre ?

- Une entreprise à taille humaine
- Des projets techniques stimulants
- Un environnement de travail moderne
- Des possibilités d'évolution

## Nos métiers

- Ingénierie mécanique
- Usinage de précision
- Tôlerie et chaudronnerie
- Maintenance industrielle

Consultez nos offres d'emploi et envoyez-nous votre candidature !
      `.trim(),
      tags: ['recrutement', 'carrière', 'emploi'],
      published: true,
      featured: true,
      authorName: 'LLEDO Industries',
      publishedAt: new Date(),
    },
  ]

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
  }

  console.log(`✅ ${posts.length} blog posts created`)

  console.log('🌱 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
