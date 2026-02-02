import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// Role type (matches Prisma enum)
export type Role = 'CLIENT' | 'ADMIN'

declare module 'next-auth' {
  interface User {
    role: Role
    firstName: string
    lastName: string
  }
  interface Session {
    user: {
      id: string
      email: string
      role: Role
      firstName: string
      lastName: string
      image?: string | null
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/connexion',
    error: '/connexion',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error('Email ou mot de passe incorrect')
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          throw new Error('Email ou mot de passe incorrect')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Première connexion : stocker les données de l'utilisateur
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      
      // Mise à jour de session demandée (après modification du profil)
      if (trigger === 'update' && token.sub) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { firstName: true, lastName: true, role: true }
        })
        if (freshUser) {
          token.firstName = freshUser.firstName
          token.lastName = freshUser.lastName
          token.role = freshUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = (token.role as Role) || 'CLIENT'
        session.user.firstName = (token.firstName as string) || ''
        session.user.lastName = (token.lastName as string) || ''
      }
      return session
    },
  },
})

// Helper to check if user is admin
export async function isAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN'
}

// Helper to get current user
export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null
  
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  })
}
