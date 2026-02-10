import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { auth } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET || ''

interface AdminPayload {
  sub: string
  email: string
  role: string
  company: string
}

/**
 * Vérifie l'authentification admin.
 * Supporte deux méthodes :
 * 1. JWT admin cookie (admin_access_token) - nouveau système
 * 2. NextAuth session avec role ADMIN - ancien système
 * 
 * Retourne les infos admin ou null si non authentifié.
 */
export async function getAdminFromRequest(): Promise<AdminPayload | null> {
  // 1. Vérifier le JWT admin cookie
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin_access_token')?.value

  if (adminToken) {
    try {
      const secret = process.env.JWT_SECRET || ''
      const payload = jwt.verify(adminToken, secret) as AdminPayload
      if (payload.sub && payload.role) {
        return payload
      }
    } catch (e) {
      console.error('[admin-guard] JWT verify error:', (e as Error).message)
    }
  }

  // 2. Fallback: vérifier la session NextAuth
  const session = await auth()
  if (session?.user?.role === 'ADMIN') {
    return {
      sub: session.user.id,
      email: session.user.email || '',
      role: 'ADMIN',
      company: '',
    }
  }

  return null
}

/**
 * Helper rapide pour vérifier si la requête vient d'un admin authentifié.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const admin = await getAdminFromRequest()
  return admin !== null
}
