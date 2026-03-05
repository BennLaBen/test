/**
 * Apply the turntable column migration directly via SQL
 * Uses .env.local for Railway DATABASE_URL
 */
import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const dbUrl = process.env.DATABASE_URL || ''
const masked = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')
console.log(`🔗 DATABASE_URL: ${masked}`)

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Adding turntable column to market_products...')
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "market_products" ADD COLUMN IF NOT EXISTS "turntable" JSONB;`)
    console.log('✅ turntable column added (or already exists)')
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
