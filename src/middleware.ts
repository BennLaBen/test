import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

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

  // Routes admin nécessitant le rôle ADMIN
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Si route admin, vérifier le rôle
  if (isAdminRoute) {
    if (!token || token.role !== 'ADMIN') {
      const url = new URL('/connexion', req.url)
      url.searchParams.set('callbackUrl', pathname)
      url.searchParams.set('error', 'AccessDenied')
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
