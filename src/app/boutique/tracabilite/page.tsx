'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Shield, Package, CheckCircle, AlertCircle, Clock, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TraceabilityPage() {
  const [serial, setSerial] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serial.trim() || serial.length < 3) return

    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/v2/traceability?serial=${encodeURIComponent(serial.trim())}`)
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, error: 'Erreur réseau' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-gray-950 to-gray-950" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Traçabilité des pièces
            </h1>
            <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10">
              Retrouvez l&apos;historique complet d&apos;une pièce LLEDO Aerotools grâce à son numéro de série.
              Conformité EASA Part 21 &amp; EN 9100.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="Entrez un numéro de série (ex: SN-BR-H160-2026-001)"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-12 pr-32 py-4 text-base focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  disabled={loading || serial.length < 3}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Rechercher'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </motion.div>
          )}

          {!loading && searched && result?.found === true && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Main card */}
              <div className="bg-gray-900 border border-emerald-500/30 rounded-xl overflow-hidden">
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Pièce authentifiée</span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left — Serial info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Numéro de série</p>
                        <p className="text-2xl font-mono font-bold text-white">{result.data.serial}</p>
                      </div>
                      {result.data.batchNumber && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Numéro de lot</p>
                          <p className="text-lg font-mono text-gray-300">{result.data.batchNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Statut</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full ${
                          result.data.status === 'SOLD' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                          result.data.status === 'IN_STOCK' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                        }`}>
                          {result.data.status === 'SOLD' ? 'Vendu' :
                           result.data.status === 'IN_STOCK' ? 'En stock' :
                           result.data.status === 'RESERVED' ? 'Réservé' :
                           result.data.status}
                        </span>
                      </div>
                      {result.data.manufacturedAt && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date de fabrication</p>
                          <p className="text-gray-300">
                            {new Date(result.data.manufacturedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right — Product info */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Produit</p>
                        <p className="text-lg font-semibold text-white">{result.data.product.name}</p>
                        <p className="text-sm text-gray-400 font-mono">{result.data.product.sku}</p>
                      </div>
                      {result.data.product.certifications?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Certifications</p>
                          <div className="flex flex-wrap gap-2">
                            {result.data.product.certifications.map((cert: string) => (
                              <span key={cert} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.data.product.warranty && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Garantie</p>
                          <p className="text-gray-300">{result.data.product.warranty}</p>
                        </div>
                      )}
                      <Link
                        href={`/boutique/${result.data.product.slug}`}
                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Voir la fiche produit <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Order info */}
                  {result.data.order && (
                    <div className="mt-8 pt-6 border-t border-gray-800">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Commande associée</p>
                      <div className="flex items-center gap-4">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-white font-mono">{result.data.order.reference}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(result.data.order.createdAt).toLocaleDateString('fr-FR')}
                            {result.data.order.deliveredAt && (
                              <> — Livré le {new Date(result.data.order.deliveredAt).toLocaleDateString('fr-FR')}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {!loading && searched && result?.found === false && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Aucun résultat</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Aucune pièce ne correspond au numéro de série &laquo;&nbsp;{serial}&nbsp;&raquo;.
                Vérifiez que le numéro est correct ou contactez notre support.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Contacter le support
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info section */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {[
              {
                icon: Shield,
                title: 'Authenticité garantie',
                desc: 'Chaque pièce fabriquée par LLEDO Aerotools reçoit un numéro de série unique, gravé et enregistré en base.',
              },
              {
                icon: FileText,
                title: 'Documentation complète',
                desc: 'Retrouvez les certificats de conformité, rapports d\'essai et déclarations CE associés à votre pièce.',
              },
              {
                icon: Clock,
                title: 'Historique complet',
                desc: 'Date de fabrication, lot de production, commande associée, date de livraison — tout est tracé.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
