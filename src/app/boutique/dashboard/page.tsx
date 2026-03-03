'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Package, Clock, CheckCircle, AlertCircle, ChevronRight, Search, Filter, Building2, User, TrendingUp, BarChart3 } from 'lucide-react'
import Link from 'next/link'

type QuoteData = {
  id: string
  reference: string
  status: string
  contactCompany: string
  createdAt: string
  updatedAt: string
  totalAmount: number | null
  items: { id: string; quantity: number; product: { name: string; sku: string; image: string } }[]
}

type OrderData = {
  id: string
  reference: string
  status: string
  totalAmount: number
  createdAt: string
  shippedAt: string | null
  deliveredAt: string | null
  items: { id: string; quantity: number; product: { name: string; sku: string; image: string } }[]
}

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  DRAFT: { label: 'Brouillon', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30', icon: FileText },
  SUBMITTED: { label: 'Soumis', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Clock },
  IN_REVIEW: { label: 'En cours d\'analyse', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: Search },
  QUOTED: { label: 'Devis envoyé', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: FileText },
  ACCEPTED: { label: 'Accepté', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: CheckCircle },
  REJECTED: { label: 'Refusé', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: AlertCircle },
  EXPIRED: { label: 'Expiré', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30', icon: Clock },
  CONVERTED: { label: 'Converti en commande', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: Package },
  PENDING: { label: 'En attente', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: Clock },
  CONFIRMED: { label: 'Confirmée', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: CheckCircle },
  IN_PRODUCTION: { label: 'En production', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: Package },
  READY_TO_SHIP: { label: 'Prêt à expédier', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: Package },
  SHIPPED: { label: 'Expédié', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Package },
  DELIVERED: { label: 'Livré', color: 'text-green-400 bg-green-500/10 border-green-500/30', icon: CheckCircle },
  CANCELLED: { label: 'Annulée', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: AlertCircle },
}

function StatusBadge({ status }: { status: string }) {
  const s = statusLabels[status] || { label: status, color: 'text-gray-400 bg-gray-500/10 border-gray-500/30', icon: FileText }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${s.color}`}>
      <s.icon className="w-3 h-3" />
      {s.label}
    </span>
  )
}

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'quotes' | 'orders'>('quotes')
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [quotesRes, ordersRes] = await Promise.all([
          fetch('/api/v2/quotes?limit=50').then(r => r.json()),
          fetch('/api/v2/orders?limit=50').then(r => r.json()),
        ])
        if (quotesRes.success) setQuotes(quotesRes.data)
        if (ordersRes.success) setOrders(ordersRes.data)
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = {
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter(q => ['SUBMITTED', 'IN_REVIEW'].includes(q.status)).length,
    totalOrders: orders.length,
    activeOrders: orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length,
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Espace Acheteur</h1>
            <p className="text-sm text-gray-400">Suivi de vos devis et commandes</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/boutique/devis"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Nouveau devis
            </Link>
            <Link
              href="/boutique/catalogue"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
            >
              Catalogue
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Devis total', value: stats.totalQuotes, icon: FileText, color: 'blue' },
            { label: 'Devis en cours', value: stats.pendingQuotes, icon: Clock, color: 'amber' },
            { label: 'Commandes', value: stats.totalOrders, icon: Package, color: 'green' },
            { label: 'En production', value: stats.activeOrders, icon: TrendingUp, color: 'purple' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 mb-6 w-fit">
          {(['quotes', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'quotes' ? 'Devis' : 'Commandes'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : activeTab === 'quotes' ? (
          <div className="space-y-3">
            {quotes.length === 0 ? (
              <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Aucun devis</h3>
                <p className="text-gray-400 mb-6">Vous n&apos;avez pas encore soumis de demande de devis.</p>
                <Link
                  href="/boutique/devis"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
                >
                  Créer votre premier devis
                </Link>
              </div>
            ) : (
              quotes.map((quote, i) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/boutique/dashboard/quotes/${quote.reference}`}
                    className="block bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-white">{quote.reference}</span>
                            <StatusBadge status={quote.status} />
                          </div>
                          <p className="text-sm text-gray-400 mt-0.5">
                            {quote.items.length} produit(s) — {new Date(quote.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {quote.totalAmount && (
                          <span className="text-lg font-semibold text-white">
                            {Number(quote.totalAmount).toLocaleString('fr-FR')} &euro;
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" />
                      </div>
                    </div>
                    {/* Products preview */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quote.items.slice(0, 3).map(item => (
                        <span key={item.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {item.product.sku} &times; {item.quantity}
                        </span>
                      ))}
                      {quote.items.length > 3 && (
                        <span className="text-xs text-gray-500">+{quote.items.length - 3} autre(s)</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Aucune commande</h3>
                <p className="text-gray-400">Vos commandes apparaîtront ici une fois un devis accepté.</p>
              </div>
            ) : (
              orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">{order.reference}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {order.items.length} produit(s) — {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-white">
                        {Number(order.totalAmount).toLocaleString('fr-FR')} &euro;
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  {/* Timeline for shipped orders */}
                  {order.shippedAt && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <Package className="w-3 h-3" />
                      Expédié le {new Date(order.shippedAt).toLocaleDateString('fr-FR')}
                      {order.deliveredAt && (
                        <>
                          <span className="text-gray-600">→</span>
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          Livré le {new Date(order.deliveredAt).toLocaleDateString('fr-FR')}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
