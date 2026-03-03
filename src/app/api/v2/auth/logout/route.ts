import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/v2/auth/logout — Destroy session in DB and clear cookie
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value

    if (token) {
      // Delete session from DB
      await prisma.session.deleteMany({
        where: { sessionToken: token },
      })
    }

    const response = NextResponse.json({ success: true })
    
    // Clear cookie
    response.cookies.delete('session-token')

    console.log('[auth] ✅ User logged out')
    return response
  } catch (error) {
    console.error('[API v2] POST /auth/logout error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
