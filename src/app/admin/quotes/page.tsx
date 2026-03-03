'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, CheckCircle, AlertCircle, Eye, ChevronDown, Search, RefreshCw, Package, ArrowRight } from 'lucide-react'

type Quote = {
  id: string
  reference: string
  status: string
  contactName: string | null
  contactEmail: string | null
  contactCompany: string | null
  notes: string | null
  totalAmount: number | null
  createdAt: string
  updatedAt: string
  items: { id: string; quantity: number; product: { name: string; sku: string } }[]
  user: { firstName: string; lastName: string; email: string } | null
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Brouillon', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
  SUBMITTED: { label: 'Soumis', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  IN_REVIEW: { label: 'En analyse', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  QUOTED: { label: 'Devis envoyé', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  ACCEPTED: { label: 'Accepté', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  REJECTED: { label: 'Refusé', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  EXPIRED: { label: 'Expiré', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/30' },
  CONVERTED: { label: 'Converti', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
}

const allStatuses = ['SUBMITTED', 'IN_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED']

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const url = filterStatus
        ? `/api/v2/quotes?status=${filterStatus}&limit=50`
        : '/api/v2/quotes?limit=50'
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setQuotes(data.data)
    } catch (e) {
      console.error('Failed to fetch quotes:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQuotes() }, [filterStatus])

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const res = await fetch(`/api/v2/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q))
        if (selectedQuote?.id === quoteId) {
          setSelectedQuote({ ...selectedQuote, status: newStatus })
        }
      }
    } catch (e) {
      console.error('Failed to update quote:', e)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const stats = {
    total: quotes.length,
    submitted: quotes.filter(q => q.status === 'SUBMITTED').length,
    inReview: quotes.filter(q => q.status === 'IN_REVIEW').length,
    quoted: quotes.filter(q => q.status === 'QUOTED').length,
    accepted: quotes.filter(q => q.status === 'ACCEPTED').length,
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestion des Devis (RFQ)</h1>
            <p className="text-sm text-gray-400 mt-1">Marketplace Aerotools — Pipeline commercial</p>
          </div>
          <button
            onClick={fetchQuotes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'blue' },
            { label: 'Nouveaux', value: stats.submitted, color: 'blue' },
            { label: 'En analyse', value: stats.inReview, color: 'amber' },
            { label: 'Devis envoyé', value: stats.quoted, color: 'purple' },
            { label: 'Acceptés', value: stats.accepted, color: 'green' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold text-${s.color}-400`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Filtrer :</span>
          <button
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${!filterStatus ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            Tous
          </button>
          {['SUBMITTED', 'IN_REVIEW', 'QUOTED', 'ACCEPTED'].map(s => {
            const cfg = statusConfig[s]
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quote list */}
          <div className="lg:col-span-2 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : quotes.length === 0 ? (
              <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-xl">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucun devis {filterStatus ? `avec le statut "${statusConfig[filterStatus]?.label}"` : ''}</p>
              </div>
            ) : (
              quotes.map((quote, i) => {
                const cfg = statusConfig[quote.status] || statusConfig.DRAFT
                const isSelected = selectedQuote?.id === quote.id
                return (
                  <motion.button
                    key={quote.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedQuote(quote)}
                    className={`w-full text-left bg-gray-900 border rounded-lg p-4 transition-colors ${
                      isSelected ? 'border-blue-500/50 bg-blue-500/5' : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white">{quote.reference}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-300">{quote.contactCompany || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{quote.contactName} — {quote.items.length} produit(s)</p>
                      </div>
                      {quote.totalAmount && (
                        <span className="text-sm font-semibold text-white">{Number(quote.totalAmount).toLocaleString('fr-FR')} &euro;</span>
                      )}
                    </div>
                  </motion.button>
                )
              })
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selectedQuote ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono font-bold text-white">{selectedQuote.reference}</h3>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusConfig[selectedQuote.status]?.bg} ${statusConfig[selectedQuote.status]?.color}`}>
                    {statusConfig[selectedQuote.status]?.label}
                  </span>
                </div>

                {/* Contact */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Société</p>
                    <p className="text-sm text-white font-medium">{selectedQuote.contactCompany || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Contact</p>
                    <p className="text-sm text-gray-300">{selectedQuote.contactName}</p>
                    <p className="text-xs text-gray-500">{selectedQuote.contactEmail}</p>
                  </div>
                  {selectedQuote.notes && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Message</p>
                      <p className="text-sm text-gray-400 italic">{selectedQuote.notes}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="mb-6">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Produits ({selectedQuote.items.length})</p>
                  <div className="space-y-2">
                    {selectedQuote.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm text-white">{item.product.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{item.product.sku}</p>
                        </div>
                        <span className="text-sm text-gray-300 font-medium">&times; {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status change */}
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Changer le statut</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {allStatuses
                      .filter(s => s !== selectedQuote.status)
                      .map(s => {
                        const cfg = statusConfig[s]
                        return (
                          <button
                            key={s}
                            onClick={() => updateQuoteStatus(selectedQuote.id, s)}
                            disabled={updatingStatus}
                            className={`px-2 py-1.5 text-[10px] font-medium rounded border ${cfg.bg} ${cfg.color} hover:opacity-80 transition-opacity disabled:opacity-50`}
                          >
                            {cfg.label}
                          </button>
                        )
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                <Eye className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Sélectionnez un devis pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
