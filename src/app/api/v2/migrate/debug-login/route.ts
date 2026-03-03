import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// Temporary debug endpoint — REMOVE AFTER DEBUGGING
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
      },
    })

    if (!user) {
      // List all user emails to debug
      const allUsers = await prisma.user.findMany({ select: { email: true, role: true } })
      return NextResponse.json({
        debug: 'USER_NOT_FOUND',
        searchedEmail: email.toLowerCase(),
        allUsersInDB: allUsers.map(u => `${u.email} (${u.role})`),
      })
    }

    const hasPassword = !!user.password
    const passwordLength = user.password?.length || 0
    const hashPrefix = user.password?.substring(0, 7) || 'NONE'
    
    let bcryptResult = false
    let bcryptError = null
    try {
      bcryptResult = await bcrypt.compare(password, user.password)
    } catch (e: any) {
      bcryptError = e.message
    }

    return NextResponse.json({
      debug: 'USER_FOUND',
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      hasPassword,
      passwordLength,
      hashPrefix,
      bcryptResult,
      bcryptError,
    })
  } catch (error: any) {
    return NextResponse.json({ debug: 'ERROR', message: error.message }, { status: 500 })
  }
}
