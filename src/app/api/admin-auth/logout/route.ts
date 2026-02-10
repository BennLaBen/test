import { NextRequest, NextResponse } from 'next/server'
import { validateSession, getAccessTokenFromCookie, invalidateSession, clearAuthCookies } from '@/lib/auth/jwt'
import { logSecurityEvent } from '@/lib/auth/security'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const userAgent = request.headers.get('user-agent')
  
  try {
    const accessToken = await getAccessTokenFromCookie()
    
    if (accessToken) {
      const session = await validateSession(accessToken)
      
      if (session.isValid && session.admin && session.sessionId) {
        // Invalidate the session
        await invalidateSession(session.sessionId)
        
        // Log the logout
        await logSecurityEvent({
          adminId: session.admin.id,
          eventType: 'LOGOUT',
          ipAddress: ip,
          userAgent: userAgent || undefined,
          status: 'SUCCESS',
        })
      }
    }
    
    // Clear auth cookies
    await clearAuthCookies()
    
    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
    
  } catch (error) {
    console.error('Logout error:', error)
    
    // Still clear cookies even if there's an error
    await clearAuthCookies()
    
    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  }
}
