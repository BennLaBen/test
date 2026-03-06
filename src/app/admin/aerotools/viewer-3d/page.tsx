'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import {
  Box, ArrowLeft, Check, Loader2, Search, Upload,
  RotateCw, ChevronDown, Image as ImageIcon, Link2, Eye, Zap, Trash2
} from 'lucide-react'
import Link from 'next/link'

const TurntableGenerator = dynamic(
  () => import('@/components/aerotools/TurntableGenerator').then(mod => ({ default: mod.TurntableGenerator })),
  { ssr: false }
)

const SecureTurntableViewer = dynamic(
  () => import('@/components/aerotools/SecureTurntableViewer').then(mod => ({ default: mod.SecureTurntableViewer })),
  { ssr: false }
)

interface Product {
  id: string
  slug: string
  name: string
  sku: string
  turntable?: { enabled: boolean; hFrames: number; vLevels: number; format: string; baseUrl?: string } | null
}

type Mode = 'choose' | 'generate' | 'quick-activate'

export default function AdminViewer3DPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [mode, setMode] = useState<Mode>('choose')
  const [generationDone, setGenerationDone] = useState(false)
  const [linking, setLinking] = useState(false)
  const [linked, setLinked] = useState(false)
  const [turntableBaseUrl, setTurntableBaseUrl] = useState('')
  const [previewSlug, setPreviewSlug] = useState<string | null>(null)
  const [quickSlug, setQuickSlug] = useState('')
  const [removing, setRemoving] = useState<string | null>(null)

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/v2/products?admin=true&limit=100')
        const data = await res.json()
        if (data.data) {
          setProducts(data.data.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            sku: p.sku,
            turntable: p.turntable,
          })))
        }
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const productsWithTurntable = products.filter(p => p.turntable?.enabled)

  const handleGenerationComplete = useCallback((config: { hFrames: number; vLevels: number; format: string; baseUrl: string }) => {
    setGenerationDone(true)
    setTurntableBaseUrl(config.baseUrl)
  }, [])

  const handleLinkToProduct = useCallback(async (baseUrlOverride?: string) => {
    if (!selectedProduct) return
    setLinking(true)
    const finalBaseUrl = baseUrlOverride || turntableBaseUrl || `/images/aerotools/360/${selectedProduct.slug}`
    try {
      const res = await fetch(`/api/v2/products/${selectedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turntable: { enabled: true, hFrames: 36, vLevels: 3, format: 'webp', baseUrl: finalBaseUrl },
        }),
      })
      const data = await res.json()
      if (data.success) {
        setLinked(true)
        setProducts(prev => prev.map(p =>
          p.id === selectedProduct.id
            ? { ...p, turntable: { enabled: true, hFrames: 36, vLevels: 3, format: 'webp', baseUrl: finalBaseUrl } }
            : p
        ))
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de lier le produit'))
      }
    } catch (err) {
      console.error('Link error:', err)
      alert('Erreur réseau')
    } finally {
      setLinking(false)
    }
  }, [selectedProduct, turntableBaseUrl])

  const handleRemoveTurntable = useCallback(async (product: Product) => {
    if (!confirm(`Supprimer la vue 360° de « ${product.name} » ?\n\nLes images resteront sur le serveur mais ne seront plus affichées sur la boutique.`)) return
    setRemoving(product.id)
    try {
      const res = await fetch(`/api/v2/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turntable: null }),
      })
      const data = await res.json()
      if (data.success) {
        setProducts(prev => prev.map(p =>
          p.id === product.id ? { ...p, turntable: null } : p
        ))
        alert(`Vue 360° supprimée pour « ${product.name} »`)
      } else {
        alert('Erreur: ' + (data.error || 'Impossible de supprimer'))
      }
    } catch (err) {
      console.error('Remove turntable error:', err)
      alert('Erreur réseau')
    } finally {
      setRemoving(null)
    }
  }, [])

  const resetAll = useCallback(() => {
    setSelectedProduct(null)
    setMode('choose')
    setGenerationDone(false)
    setLinked(false)
    setSearch('')
    setTurntableBaseUrl('')
    setQuickSlug('')
  }, [])

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
              Générateur &amp; Viewer 360°
            </h1>
          </div>
          <span className="ml-auto text-xs text-gray-400 uppercase tracking-wider">Admin uniquement</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* ═══ ACTION CARDS ═══ */}
        {mode === 'choose' && !linked && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Card: Generate new */}
            <button
              onClick={() => setMode('generate')}
              className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 p-6 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Générer un turntable
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Glisser un fichier <strong>STL</strong> pour générer 108 images 360° dans le navigateur, puis les relier à un produit.
              </p>
              <p className="text-xs text-gray-400 mt-2">Le fichier STL ne quitte jamais votre navigateur.</p>
            </button>

            {/* Card: Quick activate */}
            <button
              onClick={() => setMode('quick-activate')}
              className="text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 p-6 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                  Activer un turntable existant
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                Les images 360° sont déjà sur le serveur ? Reliez-les directement à un produit en un clic.
              </p>
              <p className="text-xs text-gray-400 mt-2">Ex: roller-h125 (déjà généré)</p>
            </button>
          </div>
        )}

        {/* ═══ MODE: GENERATE ═══ */}
        {mode === 'generate' && !linked && (
          <>
            {/* Back */}
            <button onClick={() => { setMode('choose'); setSelectedProduct(null); setGenerationDone(false) }}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Retour au choix
            </button>

            {/* Step 1: Select Product */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  selectedProduct ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {selectedProduct ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Sélectionner un produit</h2>
                  <p className="text-xs text-gray-500">Choisissez le produit à associer aux images 360°</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Chargement des produits...
                </div>
              ) : selectedProduct && !generationDone ? (
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-300">{selectedProduct.name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {selectedProduct.sku} &bull; slug: {selectedProduct.slug}
                      {selectedProduct.turntable?.enabled && ' • Vue 360° déjà active (sera remplacée)'}
                    </p>
                  </div>
                  <button onClick={() => setSelectedProduct(null)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Changer</button>
                </div>
              ) : !generationDone ? (
                <ProductSearchDropdown
                  search={search} setSearch={setSearch}
                  showDropdown={showDropdown} setShowDropdown={setShowDropdown}
                  filteredProducts={filteredProducts}
                  onSelect={(p) => { setSelectedProduct(p); setShowDropdown(false); setSearch('') }}
                />
              ) : (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4">
                  <p className="text-sm font-bold text-green-800 dark:text-green-300">{selectedProduct?.name}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{selectedProduct?.sku} &bull; {selectedProduct?.slug}</p>
                </div>
              )}
            </div>

            {/* Step 2: Generate */}
            {selectedProduct && !generationDone && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">2</div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Glisser le fichier STL</h2>
                    <p className="text-xs text-gray-500">108 images seront générées dans votre navigateur et uploadées automatiquement</p>
                  </div>
                </div>
                <TurntableGenerator slug={selectedProduct.slug} onComplete={handleGenerationComplete} />
              </div>
            )}

            {/* Step 3: Link */}
            {generationDone && !linked && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">3</div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Activer la vue 360° sur le site</h2>
                    <p className="text-xs text-gray-500">Relier les images au produit <strong>{selectedProduct?.name}</strong></p>
                  </div>
                </div>
                <button onClick={() => handleLinkToProduct()} disabled={linking}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-colors">
                  {linking
                    ? <><Loader2 className="h-5 w-5 animate-spin" /> Mise à jour...</>
                    : <><Link2 className="h-5 w-5" /> Activer la vue 360° pour &laquo; {selectedProduct?.name} &raquo;</>
                  }
                </button>
              </div>
            )}
          </>
        )}

        {/* ═══ MODE: QUICK ACTIVATE ═══ */}
        {mode === 'quick-activate' && !linked && (
          <>
            <button onClick={() => { setMode('choose'); setSelectedProduct(null); setQuickSlug('') }}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Retour au choix
            </button>

            {/* Select product */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  selectedProduct ? 'bg-green-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {selectedProduct ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Sélectionner le produit à activer</h2>
                  <p className="text-xs text-gray-500">Choisissez le produit dont les images 360° existent déjà</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> Chargement...
                </div>
              ) : selectedProduct ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-bold text-green-800 dark:text-green-300">{selectedProduct.name}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{selectedProduct.sku} &bull; {selectedProduct.slug}</p>
                  </div>
                  <button onClick={() => setSelectedProduct(null)}
                    className="text-xs text-green-600 dark:text-green-400 hover:underline">Changer</button>
                </div>
              ) : (
                <ProductSearchDropdown
                  search={search} setSearch={setSearch}
                  showDropdown={showDropdown} setShowDropdown={setShowDropdown}
                  filteredProducts={filteredProducts}
                  onSelect={(p) => { setSelectedProduct(p); setShowDropdown(false); setSearch(''); setQuickSlug(p.slug) }}
                />
              )}
            </div>

            {/* Slug for images */}
            {selectedProduct && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-500 text-white">2</div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Slug des images turntable</h2>
                    <p className="text-xs text-gray-500">Le dossier contenant les 108 images WebP (par défaut: slug du produit)</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={quickSlug}
                  onChange={(e) => setQuickSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
                  placeholder="ex: roller-h125"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                />

                {quickSlug && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setPreviewSlug(quickSlug)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Prévisualiser
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {previewSlug && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500">Prévisualisation: <span className="font-mono text-gray-900 dark:text-white">{previewSlug}</span></p>
                </div>
                <div className="h-[500px]">
                  <SecureTurntableViewer
                    slug={previewSlug}
                    productName={selectedProduct?.name || previewSlug}
                    hFrames={36}
                    vLevels={3}
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* Activate button */}
            {selectedProduct && quickSlug && (
              <button
                onClick={() => handleLinkToProduct(`/images/aerotools/360/${quickSlug}`)}
                disabled={linking}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl transition-colors"
              >
                {linking
                  ? <><Loader2 className="h-5 w-5 animate-spin" /> Activation...</>
                  : <><Zap className="h-5 w-5" /> Activer la vue 360° pour &laquo; {selectedProduct.name} &raquo;</>
                }
              </button>
            )}
          </>
        )}

        {/* ═══ SUCCESS ═══ */}
        {linked && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-green-800 dark:text-green-300">Vue 360° activée avec succès !</h2>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Les images sont en ligne et liées au produit &laquo; {selectedProduct?.name} &raquo;
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Link href={`/boutique/${selectedProduct?.slug}`} target="_blank"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors">
                <ImageIcon className="h-4 w-4" /> Voir sur le site
              </Link>
              <button onClick={resetAll}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <RotateCw className="h-4 w-4" /> Recommencer
              </button>
            </div>
          </div>
        )}

        {/* ═══ EXISTING TURNTABLES ═══ */}
        {productsWithTurntable.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green-500" />
              Produits avec vue 360° active ({productsWithTurntable.length})
            </h3>
            <div className="space-y-2">
              {productsWithTurntable.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sku} &bull; {p.turntable?.hFrames || 36} angles &times; {p.turntable?.vLevels || 3} élévations</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/boutique/${p.slug}`} target="_blank" className="text-xs text-blue-500 hover:underline">Voir</Link>
                    <button
                      onClick={() => handleRemoveTurntable(p)}
                      disabled={removing === p.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                    >
                      {removing === p.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Trash2 className="h-3 w-3" />
                      }
                      Supprimer
                    </button>
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Sécurité :</strong> Le fichier STL reste dans votre navigateur et n&apos;est jamais envoyé au serveur.
            Seules les 108 images WebP sont uploadées. Aucun visiteur ne peut accéder au modèle 3D.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Reusable product search dropdown ───────────────────────────────────────

function ProductSearchDropdown({
  search, setSearch, showDropdown, setShowDropdown, filteredProducts, onSelect,
}: {
  search: string
  setSearch: (s: string) => void
  showDropdown: boolean
  setShowDropdown: (b: boolean) => void
  filteredProducts: Product[]
  onSelect: (p: Product) => void
}) {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowDropdown(true) }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Rechercher un produit par nom, slug ou SKU..."
          className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">Aucun produit trouvé</p>
          ) : filteredProducts.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
              <p className="text-xs text-gray-500">
                {p.sku} &bull; {p.slug}
                {p.turntable?.enabled && (
                  <span className="ml-2 text-green-500">&bull; Vue 360° active</span>
                )}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
