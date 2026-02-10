import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/admin-auth/check-email - Check if an email belongs to an admin
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ isAdmin: false })
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true },
    })

    return NextResponse.json({ isAdmin: !!admin })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
