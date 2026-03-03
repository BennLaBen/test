import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'rayancarre68@gmail.com'
  const password = 'Lledo2026!'

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, role: true }
  })

  if (!user) {
    console.log('User NOT FOUND')
    return
  }

  console.log(`User found: ${user.email} (role=${user.role})`)
  console.log(`Password hash (first 20 chars): ${user.password.substring(0, 20)}...`)
  
  const valid = await bcrypt.compare(password, user.password)
  console.log(`bcrypt.compare("${password}", hash) = ${valid}`)
}

main().finally(() => process.exit(0))
