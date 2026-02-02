import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

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
    if (!session?.user || session.user.role !== 'ADMIN') {
      const url = new URL('/connexion', req.url)
      url.searchParams.set('callbackUrl', pathname)
      url.searchParams.set('error', 'AccessDenied')
      return NextResponse.redirect(url)
    }
  }

  // Si route protégée, vérifier l'authentification
  if (isProtectedRoute && !session?.user) {
    const url = new URL('/connexion', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/espace-client/:path*',
    '/account/:path*',
    '/admin/:path*',
  ],
}
