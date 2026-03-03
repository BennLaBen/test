import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes requiring authentication
const protectedRoutes = ['/espace-client']
// Routes requiring admin role
const adminRoutes = ['/admin']
// Auth routes (redirect if already logged in)
const authRoutes = ['/connexion', '/inscription']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'ADMIN'

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  // Protect client routes
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/connexion?callbackUrl=${callbackUrl}`, nextUrl)
    )
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL('/connexion?error=admin_required', nextUrl)
      )
    }
    if (!isAdmin) {
      return NextResponse.redirect(
        new URL('/?error=unauthorized', nextUrl)
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/espace-client/:path*',
    '/connexion',
    '/inscription',
  ],
}
