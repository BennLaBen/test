'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuote } from '@/contexts/QuoteContext'
import { Breadcrumbs } from '@/components/shop/Breadcrumbs'
import { Send, CheckCircle, Package, ArrowRight, Shield, Phone, Building2, User, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, clearQuote, itemCount } = useQuote()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/shop/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price_display: item.price_display || 'SUR DEVIS',
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur lors de l\'envoi')
        return
      }

      setIsSuccess(true)
      setTimeout(() => clearQuote(), 500)
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 pt-28">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full bg-gray-800/50 border border-green-500/30 rounded-2xl p-10 text-center backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-4">Demande transmise</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Votre demande de devis pour <strong>{itemCount} équipement(s)</strong> a été envoyée avec succès.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Un ingénieur commercial vous contactera sous 24 à 48 heures ouvrées. Un email de confirmation a été envoyé à <strong className="text-gray-300">{form.email}</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold uppercase rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Retour au catalogue
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-bold uppercase rounded-xl hover:bg-gray-800 transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              Nous contacter
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4 pt-28">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-700 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase mb-4 text-gray-400">Panier vide</h2>
          <p className="text-gray-600 mb-8">Ajoutez des équipements au panier avant de demander un devis.</p>
          <Link
            href="/boutique/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold uppercase rounded-xl hover:bg-blue-500 transition-colors text-sm"
          >
            Voir le catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Breadcrumbs items={[
            { label: 'Panier', href: '/boutique/panier' },
            { label: 'Demande de devis' },
          ]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Demande de devis</h1>
            <p className="text-gray-500 text-sm mb-8">Remplissez le formulaire ci-dessous. Nous vous répondrons sous 24 à 48h ouvrées.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <Building2 className="h-3.5 w-3.5" />
                  Société / Organisation *
                </label>
                <input
                  required
                  type="text"
                  value={form.company}
                  onChange={e => update('company', e.target.value)}
                  placeholder="Nom de votre structure"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <User className="h-3.5 w-3.5" />
                    Nom complet *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Mail className="h-3.5 w-3.5" />
                    Email professionnel *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="contact@societe.com"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <Phone className="h-3.5 w-3.5" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message / Précisions
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  placeholder="Quantités souhaitées, délais, spécifications particulières..."
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-black uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Transmettre la demande de devis
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </button>

              <p className="text-[10px] text-gray-600 text-center">
                En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 pb-4 border-b border-gray-700">
                Récapitulatif — {itemCount} équipement(s)
              </h3>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-3 pb-3 border-b border-gray-800 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] font-mono text-gray-600">{item.id}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded flex-shrink-0">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-700 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  Données transmises de manière sécurisée
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="h-3.5 w-3.5 text-blue-500" />
                  Réponse sous 24-48h ouvrées
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
