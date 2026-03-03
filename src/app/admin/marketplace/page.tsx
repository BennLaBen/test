'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Package, FileText, ShoppingBag, TrendingUp, AlertTriangle, RefreshCw, ArrowRight, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  overview: {
    totalProducts: number
    publishedProducts: number
    totalQuotes: number
    recentQuotes: number
    totalOrders: number
    recentOrders: number
    totalRevenue: number
  }
  funnel: { submitted: number; reviewed: number; quoted: number; accepted: number; converted: number }
  quotesByStatus: Record<string, number>
  ordersByStatus: Record<string, { count: number; revenue: number }>
  topProducts: { productId: string; name: string; sku: string; quoteCount: number; totalQuantity: number }[]
  categoriesBreakdown: { categoryId: string; label: string; productCount: number }[]
  alerts: { lowStock: { id: string; sku: string; name: string; stockQuantity: number }[] }
}

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-blue-500',
  IN_REVIEW: 'bg-amber-500',
  QUOTED: 'bg-purple-500',
  ACCEPTED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  EXPIRED: 'bg-gray-500',
  CONVERTED: 'bg-emerald-500',
  PENDING: 'bg-amber-500',
  CONFIRMED: 'bg-blue-500',
  IN_PRODUCTION: 'bg-orange-500',
  SHIPPED: 'bg-cyan-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
}

export default function MarketplaceAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/v2/analytics?period=${period}`)
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch (e) {
      console.error('Analytics fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [period])

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  const funnelSteps = [
    { label: 'Soumis', value: data.funnel.submitted, color: 'bg-blue-500' },
    { label: 'Analysés', value: data.funnel.reviewed, color: 'bg-amber-500' },
    { label: 'Devisés', value: data.funnel.quoted, color: 'bg-purple-500' },
    { label: 'Acceptés', value: data.funnel.accepted, color: 'bg-green-500' },
    { label: 'Convertis', value: data.funnel.converted, color: 'bg-emerald-500' },
  ]
  const maxFunnel = Math.max(data.funnel.submitted, 1)

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Marketplace</h1>
            <p className="text-sm text-gray-400 mt-1">Vue d&apos;ensemble de la performance commerciale</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
              {['7d', '30d', '90d', '1y'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${period === p ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button onClick={fetchData} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Produits publiés', value: data.overview.publishedProducts, total: data.overview.totalProducts, icon: Package, color: 'blue' },
            { label: 'Devis (période)', value: data.overview.recentQuotes, total: data.overview.totalQuotes, icon: FileText, color: 'amber' },
            { label: 'Commandes (période)', value: data.overview.recentOrders, total: data.overview.totalOrders, icon: ShoppingBag, color: 'green' },
            { label: 'CA total', value: data.overview.totalRevenue, icon: DollarSign, color: 'purple', isCurrency: true },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`w-5 h-5 text-${kpi.color}-400`} />
                {kpi.total !== undefined && (
                  <span className="text-[10px] text-gray-500">/ {kpi.total} total</span>
                )}
              </div>
              <p className="text-2xl font-bold text-white">
                {(kpi as any).isCurrency
                  ? `${kpi.value.toLocaleString('fr-FR')} €`
                  : kpi.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversion Funnel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Funnel de conversion
            </h2>
            <div className="space-y-3">
              {funnelSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-20 text-right">{step.label}</span>
                  <div className="flex-1 bg-gray-800 rounded-full h-7 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max((step.value / maxFunnel) * 100, 2)}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className={`h-full ${step.color} rounded-full flex items-center justify-end pr-2`}
                    >
                      <span className="text-[10px] text-white font-bold">{step.value}</span>
                    </motion.div>
                  </div>
                  {i > 0 && funnelSteps[i - 1].value > 0 && (
                    <span className="text-[10px] text-gray-500 w-12 text-right">
                      {Math.round((step.value / funnelSteps[i - 1].value) * 100)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Quoted Products */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Produits les plus demandés
            </h2>
            {data.topProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">Aucune donnée disponible</p>
            ) : (
              <div className="space-y-2">
                {data.topProducts.slice(0, 8).map((product, i) => (
                  <div key={product.productId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="text-xs text-gray-600 w-5">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{product.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{product.quoteCount}</p>
                      <p className="text-[10px] text-gray-500">devis</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quotes by Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Devis par statut</h2>
            <div className="space-y-2">
              {Object.entries(data.quotesByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status] || 'bg-gray-500'}`} />
                    <span className="text-xs text-gray-300">{status}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
            <Link href="/admin/quotes" className="mt-4 flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Gérer les devis <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Categories Breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Produits par catégorie</h2>
            <div className="space-y-2">
              {data.categoriesBreakdown.map(cat => (
                <div key={cat.categoryId} className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{cat.label}</span>
                  <span className="text-sm font-semibold text-white">{cat.productCount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Alertes stock bas
            </h2>
            {data.alerts.lowStock.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">Aucune alerte</p>
            ) : (
              <div className="space-y-2">
                {data.alerts.lowStock.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <div>
                      <p className="text-xs text-white">{item.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{item.sku}</p>
                    </div>
                    <span className="text-sm font-bold text-amber-400">{item.stockQuantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
