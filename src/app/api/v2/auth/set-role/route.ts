import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/v2/auth/set-role — Temp endpoint to set admin role
export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()

    const user = await prisma.user.update({
      where: { email },
      data: { role },
    })

    return NextResponse.json({ email: user.email, role: user.role })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
