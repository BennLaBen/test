'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, ArrowLeft, Image as ImageIcon, Cuboid, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const SecureTurntableViewer = dynamic(
  () => import('@/components/aerotools/SecureTurntableViewer').then(mod => ({ default: mod.SecureTurntableViewer })),
  { ssr: false }
)

const SecureModelViewer = dynamic(
  () => import('@/components/aerotools/SecureModelViewer').then(mod => ({ default: mod.SecureModelViewer })),
  { ssr: false }
)

const DEMO_MODELS = [
  {
    slug: 'roller-h125',
    name: 'Roller H125',
    subtitle: 'Roller hydraulique pour hélicoptère H125 / AS350',
    hFrames: 36,
    vLevels: 3,
  },
]

export default function AdminViewer3DPage() {
  const [viewMode, setViewMode] = useState<'turntable' | '3d'>('turntable')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/aerotools"
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <Box className="h-5 w-5 text-blue-500" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Viewer 3D Produits
            </h1>
          </div>

          {/* Mode toggle */}
          <div className="ml-auto flex items-center gap-2">
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('turntable')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'turntable'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Turntable (sécurisé)
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === '3d'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Cuboid className="h-3.5 w-3.5" />
                3D (preview)
              </button>
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider hidden lg:block">
              Admin uniquement
            </span>
          </div>
        </div>
      </div>

      {/* Security comparison banner */}
      {viewMode === '3d' && (
        <div className="mx-6 mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Mode 3D = Preview uniquement</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Ce mode charge le fichier GLB complet dans le navigateur. Un concurrent pourrait le récupérer via le DevTools.
              Utilisez le mode <strong>Turntable</strong> pour la présentation sécurisée — aucun fichier 3D n&apos;est envoyé.
            </p>
          </div>
        </div>
      )}

      {/* Viewers */}
      <div className="p-6 space-y-8">
        {DEMO_MODELS.map((model) => (
          <div key={model.slug} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Model title */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{model.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{model.subtitle}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                viewMode === 'turntable'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {viewMode === 'turntable' ? '🔒 Séquence d\'images' : '⚠️ GLB 3D'}
              </div>
            </div>

            {/* Viewer */}
            <div className="h-[600px]">
              {viewMode === 'turntable' ? (
                <SecureTurntableViewer
                  slug={model.slug}
                  productName={model.name}
                  hFrames={model.hFrames}
                  vLevels={model.vLevels}
                  className="w-full h-full"
                />
              ) : (
                <SecureModelViewer
                  slug={model.slug}
                  productName={model.name}
                  productSubtitle={model.subtitle}
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Info bar */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {viewMode === 'turntable'
                  ? `${model.hFrames} angles × ${model.vLevels} élévations • Images pré-rendues • Canvas sécurisé • Aucun fichier 3D`
                  : 'Modèle chargé via API sécurisée • Token HMAC • Blob URL • Anti-téléchargement'
                }
              </p>
              <p className={`text-xs font-medium ${viewMode === 'turntable' ? 'text-green-500' : 'text-amber-500'}`}>
                ● {viewMode === 'turntable' ? 'Protection maximale' : 'Preview admin'}
              </p>
            </div>
          </div>
        ))}

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6">
          <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3">
            Comment générer les images turntable ?
          </h3>
          <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-decimal list-inside">
            <li>Ouvrir <code className="bg-blue-100 dark:bg-blue-800/50 px-1.5 py-0.5 rounded text-xs">3d-pipeline/render-turntable.html</code> dans Chrome</li>
            <li>Charger le fichier GLB du produit</li>
            <li>Configurer : 36 frames horizontaux × 3 niveaux verticaux × 1200px</li>
            <li>Cliquer <strong>&quot;Lancer le rendu&quot;</strong> → attendre la fin</li>
            <li>Cliquer <strong>&quot;Télécharger ZIP&quot;</strong></li>
            <li>Extraire le ZIP dans <code className="bg-blue-100 dark:bg-blue-800/50 px-1.5 py-0.5 rounded text-xs">public/images/aerotools/360/{'{slug}'}/ </code></li>
          </ol>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
            <p className="text-xs text-green-700 dark:text-green-400">
              <strong>Sécurité :</strong> Les images turntable ne contiennent aucune géométrie 3D. Même en récupérant toutes les images,
              un concurrent ne peut pas reconstruire le modèle CAO, les cotes ou les tolérances. C&apos;est exactement l&apos;approche de Mercedes-Benz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
