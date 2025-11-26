'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  company?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem('lledo_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('lledo_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Récupérer tous les utilisateurs depuis localStorage
      const usersJson = localStorage.getItem('lledo_users')
      const users: (User & { password: string })[] = usersJson ? JSON.parse(usersJson) : []
      
      // Trouver l'utilisateur
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        return { success: false, error: 'Email ou mot de passe incorrect' }
      }

      // Connexion réussie
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('lledo_user', JSON.stringify(userWithoutPassword))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Une erreur est survenue' }
    }
  }

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Récupérer les utilisateurs existants
      const usersJson = localStorage.getItem('lledo_users')
      const users: (User & { password: string })[] = usersJson ? JSON.parse(usersJson) : []
      
      // Vérifier si l'email existe déjà
      if (users.some(u => u.email === data.email)) {
        return { success: false, error: 'Cet email est déjà utilisé' }
      }

      // Créer le nouvel utilisateur
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        createdAt: new Date().toISOString()
      }

      // Ajouter à la liste
      users.push(newUser)
      localStorage.setItem('lledo_users', JSON.stringify(users))

      // Connexion automatique
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem('lledo_user', JSON.stringify(userWithoutPassword))

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Une erreur est survenue' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('lledo_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

