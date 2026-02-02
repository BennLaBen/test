'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

/**
 * Route /account - Alias vers /espace-client/profil
 * Redirige automatiquement vers le profil si connecté,
 * sinon vers la page de connexion
 */
export default function AccountPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      // Utilisateur connecté -> redirection vers profil
      router.replace('/espace-client/profil')
    } else {
      // Non connecté -> redirection vers connexion avec callback
      router.replace('/connexion?callbackUrl=/espace-client/profil')
    }
  }, [session, status, router])

  // Affichage pendant le chargement/redirection
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-muted">Redirection en cours...</p>
      </div>
    </div>
  )
}
