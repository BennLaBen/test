import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtVerify } from 'jose'

/**
 * Middleware léger pour Edge Runtime
 * Utilise getToken de next-auth/jwt au lieu d'importer auth.ts
 * (auth.ts inclut Prisma/bcrypt qui ne sont pas compatibles Edge)
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Récupérer le token JWT (léger, compatible Edge)
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET 
  })

  // Routes protégées nécessitant une authentification
  const protectedRoutes = ['/espace-client', '/account']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Routes admin publiques (pas de vérification auth)
  const adminPublicRoutes = ['/admin/login', '/admin/forgot-password', '/admin/reset-password', '/admin/activate']
  const isAdminPublicRoute = adminPublicRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Routes API admin-auth (pas de vérification middleware)
  const isAdminAuthAPI = pathname.startsWith('/api/admin-auth')

  // Skip middleware pour les routes admin publiques et API admin-auth
  if (isAdminPublicRoute || isAdminAuthAPI) {
    return NextResponse.next()
  }

  // Routes admin nécessitant le rôle ADMIN
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Si route admin, vérifier le JWT admin (cookie admin_access_token)
  if (isAdminRoute) {
    const adminToken = req.cookies.get('admin_access_token')?.value
    
    if (!adminToken) {
      const url = new URL('/admin/login', req.url)
      return NextResponse.redirect(url)
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '')
      await jwtVerify(adminToken, secret, { algorithms: ['HS256'] })
    } catch {
      const url = new URL('/admin/login', req.url)
      return NextResponse.redirect(url)
    }
  }

  // Si route protégée, vérifier l'authentification
  if (isProtectedRoute && !token) {
    const url = new URL('/connexion', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/espace-client/:path*',
    '/account/:path*',
    '/admin/:path*',
  ],
}
