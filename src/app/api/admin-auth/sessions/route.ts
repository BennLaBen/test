import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getAccessTokenFromCookie, getActiveSessions, invalidateSession, invalidateAllSessions } from '@/lib/auth/jwt'
import { logSecurityEvent } from '@/lib/auth/security'

// GET - List active sessions
export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessTokenFromCookie()
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }
    
    const session = await validateSession(accessToken)
    if (!session.isValid || !session.admin) {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      )
    }
    
    const sessions = await getActiveSessions(session.admin.id)
    
    // Mark current session
    const sessionsWithCurrent = sessions.map(s => ({
      ...s,
      isCurrent: s.id === session.sessionId,
    }))
    
    return NextResponse.json({
      sessions: sessionsWithCurrent,
      currentSessionId: session.sessionId,
    })
    
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Kill session(s)
export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent')
  
  try {
    const accessToken = await getAccessTokenFromCookie()
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }
    
    const currentSession = await validateSession(accessToken)
    if (!currentSession.isValid || !currentSession.admin) {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const killAll = searchParams.get('all') === 'true'
    
    if (killAll) {
      // Kill all sessions except current
      const count = await invalidateAllSessions(
        currentSession.admin.id,
        currentSession.sessionId
      )
      
      await logSecurityEvent({
        adminId: currentSession.admin.id,
        eventType: 'SESSION_KILLED',
        ipAddress: ip,
        userAgent: userAgent || undefined,
        status: 'SUCCESS',
        details: { action: 'kill_all', count },
      })
      
      return NextResponse.json({
        success: true,
        message: `${count} session(s) déconnectée(s)`,
        count,
      })
    }
    
    if (sessionId) {
      // Kill specific session
      if (sessionId === currentSession.sessionId) {
        return NextResponse.json(
          { error: 'Utilisez /logout pour vous déconnecter de la session actuelle' },
          { status: 400 }
        )
      }
      
      await invalidateSession(sessionId)
      
      await logSecurityEvent({
        adminId: currentSession.admin.id,
        eventType: 'SESSION_KILLED',
        ipAddress: ip,
        userAgent: userAgent || undefined,
        status: 'SUCCESS',
        details: { action: 'kill_single', sessionId },
      })
      
      return NextResponse.json({
        success: true,
        message: 'Session déconnectée',
      })
    }
    
    return NextResponse.json(
      { error: 'Paramètre sessionId ou all requis' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Kill session error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
