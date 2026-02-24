/**
 * Script de création du premier super-admin LLEDO Industries
 * 
 * Usage: npx tsx scripts/seed-admin.ts
 * 
 * Ce script crée un super-admin avec un mot de passe temporaire.
 * L'admin devra changer son mot de passe à la première connexion.
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const BCRYPT_ROUNDS = 12

// ============================================
// CONFIGURATION DU SUPER-ADMIN
// ============================================
const SUPER_ADMIN = {
  email: (process.env.ADMIN_EMAIL || 'webmaster@mpeb13.com').toLowerCase(),
  password: process.env.ADMIN_PASSWORD || 'AAS+DE$x3Zgf',
  firstName: 'Rayan',
  lastName: 'CARRE',
  company: 'MPEB' as const,
}

async function main() {
  console.log('\n🔐 LLEDO Industries - Création du Super Admin')
  console.log('='.repeat(50))

  // Vérifier si un super-admin existe déjà
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: SUPER_ADMIN.email },
  })

  if (existingAdmin) {
    console.log(`\n⚠️  Un admin avec l'email ${SUPER_ADMIN.email} existe déjà.`)
    console.log(`   ID: ${existingAdmin.id}`)
    console.log(`   Rôle: ${existingAdmin.role}`)
    console.log(`   Actif: ${existingAdmin.isActive}`)
    console.log('\n   Supprimez-le d\'abord si vous voulez le recréer.')
    return
  }

  // Hasher le mot de passe
  console.log('\n⏳ Hashage du mot de passe (bcrypt 12 rounds)...')
  const passwordHash = await bcrypt.hash(SUPER_ADMIN.password, BCRYPT_ROUNDS)

  // Créer le super-admin
  const admin = await prisma.admin.create({
    data: {
      email: SUPER_ADMIN.email,
      passwordHash,
      firstName: SUPER_ADMIN.firstName,
      lastName: SUPER_ADMIN.lastName,
      company: SUPER_ADMIN.company,
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: false,
    },
  })

  // Logger l'événement
  await prisma.securityLog.create({
    data: {
      adminId: admin.id,
      eventType: 'ACCOUNT_CREATED',
      status: 'SUCCESS',
      details: { method: 'seed_script', createdBy: 'system' },
    },
  })

  console.log('\n✅ Super Admin créé avec succès !')
  console.log('='.repeat(50))
  console.log(`   📧 Email:       ${SUPER_ADMIN.email}`)
  console.log(`   🔑 Mot de passe: ${SUPER_ADMIN.password}`)
  console.log(`   👤 Nom:         ${SUPER_ADMIN.firstName} ${SUPER_ADMIN.lastName}`)
  console.log(`   🏢 Société:     ${SUPER_ADMIN.company}`)
  console.log(`   👑 Rôle:        SUPER_ADMIN`)
  console.log(`   🆔 ID:          ${admin.id}`)
  console.log('='.repeat(50))
  console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !')
  console.log('   Connectez-vous sur: /admin/login')
  console.log('')
}

main()
  .catch((e) => {
    console.error('\n❌ Erreur:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
