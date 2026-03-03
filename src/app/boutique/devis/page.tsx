'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Trash2, CheckCircle, AlertCircle, Building2, User, Mail, Phone, MessageSquare, Package, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface RFQItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  notes: string
}

export default function RFQPage() {
  const [items, setItems] = useState<RFQItem[]>([
    { productId: '', productName: '', sku: '', quantity: 1, notes: '' },
  ])
  const [contact, setContact] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactCompany: '',
    notes: '',
    helicopter: '',
    urgency: 'standard',
  })
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')

  // Fetch products for the dropdown
  useState(() => {
    fetch('/api/v2/products?limit=100')
      .then(r => r.json())
      .then(data => {
        if (data.success) setProducts(data.data)
      })
      .catch(() => {})
  })

  const addItem = () => {
    setItems([...items, { productId: '', productName: '', sku: '', quantity: 1, notes: '' }])
  }

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof RFQItem, value: any) => {
    const updated = [...items]
    if (field === 'productId') {
      const product = products.find((p: any) => p.id === value)
      updated[index] = {
        ...updated[index],
        productId: value,
        productName: product?.name || '',
        sku: product?.sku || '',
      }
    } else {
      (updated[index] as any)[field] = value
    }
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validItems = items.filter(i => i.productId)
    if (validItems.length === 0) {
      setError('Sélectionnez au moins un produit')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/v2/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          items: validItems.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            notes: i.notes || undefined,
          })),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setReference(data.data.reference)
      } else {
        setError(data.error || 'Erreur lors de la soumission')
      }
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Demande envoyée</h1>
          <p className="text-gray-400 mb-4">
            Votre RFQ a été transmise à notre équipe commerciale.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">Référence</p>
            <p className="text-xl font-mono font-bold text-blue-400">{reference}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Un ingénieur commercial vous contactera sous <strong className="text-white">24 à 48h ouvrées</strong>.
            Conservez votre référence pour le suivi.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/boutique/catalogue"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Continuer mes achats
            </Link>
            <Link
              href="/boutique/devis"
              onClick={() => { setSubmitted(false); setItems([{ productId: '', productName: '', sku: '', quantity: 1, notes: '' }]) }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Nouveau devis
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Demande de Devis</h1>
            <p className="text-sm text-gray-400">Request For Quotation (RFQ)</p>
          </div>
          <Link
            href="/boutique/catalogue"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Retour au catalogue
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — Products */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  Produits demandés
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Ajouter un produit
                </button>
              </div>

              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border border-gray-800 rounded-lg p-4 mb-4 last:mb-0 bg-gray-800/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="relative">
                          <label className="block text-xs text-gray-400 mb-1">Produit</label>
                          <select
                            value={item.productId}
                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            required
                          >
                            <option value="">Sélectionner un produit...</option>
                            {products.map((p: any) => (
                              <option key={p.id} value={p.id}>
                                {p.sku} — {p.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-7 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Quantité</label>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Notes (optionnel)</label>
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateItem(index, 'notes', e.target.value)}
                              placeholder="Spécifications, délai..."
                              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600"
                            />
                          </div>
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="mt-6 p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Helicopter & Urgency */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Contexte opérationnel</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Type d&apos;hélicoptère (optionnel)</label>
                  <input
                    type="text"
                    value={contact.helicopter}
                    onChange={(e) => setContact({ ...contact, helicopter: e.target.value })}
                    placeholder="Ex: H160, NH90, AS332..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Urgence</label>
                  <select
                    value={contact.urgency}
                    onChange={(e) => setContact({ ...contact, urgency: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    <option value="standard">Standard (6-8 semaines)</option>
                    <option value="priority">Prioritaire (3-4 semaines)</option>
                    <option value="aog">AOG — Urgent (sous 2 semaines)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-1">Message / Spécifications complémentaires</label>
                <textarea
                  value={contact.notes}
                  onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                  rows={3}
                  placeholder="Précisez vos besoins : adaptations spécifiques, conditions d'utilisation, exigences documentaires..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Info */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Vos coordonnées
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Société *
                  </label>
                  <input
                    type="text"
                    value={contact.contactCompany}
                    onChange={(e) => setContact({ ...contact, contactCompany: e.target.value })}
                    required
                    placeholder="Nom de votre société"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" /> Nom complet *
                  </label>
                  <input
                    type="text"
                    value={contact.contactName}
                    onChange={(e) => setContact({ ...contact, contactName: e.target.value })}
                    required
                    placeholder="Prénom Nom"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email professionnel *
                  </label>
                  <input
                    type="email"
                    value={contact.contactEmail}
                    onChange={(e) => setContact({ ...contact, contactEmail: e.target.value })}
                    required
                    placeholder="nom@societe.com"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Téléphone
                  </label>
                  <input
                    type="tel"
                    value={contact.contactPhone}
                    onChange={(e) => setContact({ ...contact, contactPhone: e.target.value })}
                    placeholder="+33 4 XX XX XX XX"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-sm text-red-400"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Soumettre la demande
                  </>
                )}
              </button>

              <p className="mt-3 text-xs text-gray-500 text-center">
                Réponse garantie sous 24-48h ouvrées
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
