'use client'

import { useQuote } from '@/contexts/QuoteContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Send, ArrowRight, ShoppingBag, AlertTriangle, CheckCircle, Package, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearQuote, itemCount } = useQuote()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/shop/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price_display: item.price_display,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Erreur lors de l\'envoi')
        return
      }

      setIsSuccess(true)
      setTimeout(() => {
        clearQuote()
      }, 500)
    } catch {
      alert('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-gray-800/50 border border-green-500/30 rounded-2xl p-8 text-center backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-4">Transmission Réussie</h2>
          <p className="text-gray-300 mb-8">Votre demande de devis a été envoyée à notre centre de commande. Un ingénieur commercial vous contactera sous 24h.</p>
          <Link 
            href="/boutique"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold uppercase rounded hover:bg-gray-100 transition-colors"
          >
            Retour au catalogue
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-blue-500/30 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Panier */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12 border-b border-gray-800 pb-8">
           <div className="flex items-center gap-4">
              <Link href="/boutique" className="p-2 hover:bg-gray-800 rounded-lg transition-colors border border-gray-700">
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                  Inventaire de <span className="text-blue-500">Mission</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Validez votre liste d'équipements pour chiffrage</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-400" />
              <span className="font-bold text-blue-300">{itemCount} Équipement(s)</span>
           </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-500 uppercase mb-4">Liste Vide</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Votre inventaire de mission est vide. Retournez au catalogue pour sélectionner vos équipements GSE.</p>
            <Link 
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold uppercase tracking-wider rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
            >
              Accéder au catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode='popLayout'>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gray-800/30 border border-gray-700 rounded-xl hover:border-blue-500/30 transition-colors group"
                  >
                    {/* Image Placeholder */}
                    <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center shrink-0 border border-gray-700">
                      <Package className="h-10 w-10 text-gray-600 group-hover:text-blue-500 transition-colors" />
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                           <h3 className="font-bold text-lg uppercase text-white">{item.name}</h3>
                           <p className="text-xs font-mono text-gray-500">{item.id}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-red-900/10 rounded"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-800 text-gray-400 font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-mono text-sm border-x border-gray-700 min-w-[3rem] text-center text-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-800 text-gray-400 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-blue-400 font-bold uppercase bg-blue-900/20 px-3 py-1 rounded border border-blue-500/20">
                          {item.price_display}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quote Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-gray-800/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 text-blue-400 border-b border-gray-700 pb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Initialisation protocole devis</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Société / Base</label>
                    <input 
                      required
                      type="text"
                      placeholder="Votre structure"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-600"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom</label>
                      <input 
                        required
                        type="text"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input 
                        required
                        type="email"
                        placeholder="email@societe.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                    <input 
                      type="tel"
                      placeholder="+33 6..."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 outline-none transition-all text-white placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message (Optionnel)</label>
                    <textarea 
                      rows={3}
                      placeholder="Précisions sur la demande..."
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded p-3 text-sm focus:border-blue-500 outline-none transition-all resize-none text-white placeholder-gray-600"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative w-full overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white font-black uppercase py-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Transmettre Demande <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                      En soumettant ce formulaire, vous acceptez notre politique de confidentialité des données industrielles.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
