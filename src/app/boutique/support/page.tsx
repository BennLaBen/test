'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Send, Phone, Mail, Clock, MessageSquare, Wrench, Package, Shield, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const faqCategories = [
  {
    id: 'ordering',
    label: 'Commandes & Devis',
    icon: Package,
    faqs: [
      { q: 'Comment passer commande ?', a: 'Toutes nos ventes se font sur devis. Utilisez notre formulaire RFQ ou contactez directement notre équipe commerciale. Après validation du devis, vous recevrez un bon de commande à signer.' },
      { q: 'Quels sont les délais de livraison ?', a: 'Les délais varient de 6 à 14 semaines selon le produit. Les barres de remorquage standard sont livrées sous 6-8 semaines. Les équipements militaires ou sur-mesure nécessitent 10-14 semaines. Un programme accéléré est disponible sur demande.' },
      { q: 'Proposez-vous des prix dégressifs ?', a: 'Oui. Les tarifs sont dégressifs à partir de 3 unités. Pour les contrats-cadres (>10 unités/an), nous proposons des conditions préférentielles. Contactez notre service commercial.' },
      { q: 'Quels modes de paiement acceptez-vous ?', a: 'Virement bancaire, bon de commande (pour les administrations et grands comptes), et lettre de crédit pour l\'international. Les conditions de paiement standard sont Net 30 jours.' },
      { q: 'Comment suivre ma commande ?', a: 'Connectez-vous à votre espace acheteur pour suivre le statut de vos devis et commandes en temps réel. Vous recevez également des notifications par email à chaque changement de statut.' },
    ],
  },
  {
    id: 'technical',
    label: 'Support technique',
    icon: Wrench,
    faqs: [
      { q: 'Le fusible de cisaillement est-il remplaçable sur site ?', a: 'Oui. Le remplacement se fait sans outillage spécifique en moins de 5 minutes. Les fusibles de rechange sont fournis par lot de 5 avec chaque barre de remorquage.' },
      { q: 'Quelle est la fréquence d\'entretien recommandée ?', a: 'Inspection visuelle avant chaque utilisation. Maintenance préventive complète tous les 6 mois ou 200 cycles (le premier atteint). Le manuel d\'utilisation détaille les points de contrôle.' },
      { q: 'Proposez-vous des formations ?', a: 'Oui. Une formation opérateur (½ journée) est incluse à la première livraison. Des formations maintenance (1 jour) et des sessions de recyclage sont disponibles sur devis.' },
      { q: 'Comment obtenir des pièces de rechange ?', a: 'Les pièces de rechange sont disponibles via notre catalogue ou sur commande directe. Les pièces d\'usure courantes (fusibles, roues, joints) sont en stock permanent.' },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications & Conformité',
    icon: Shield,
    faqs: [
      { q: 'Vos produits sont-ils certifiés pour l\'aviation civile ?', a: 'Oui. Tous nos équipements GSE sont conformes à la Directive Machines 2006/42/CE, aux normes EN 1915-1, EN 12312-1 et ISO 9667. Nous sommes certifiés EN 9100:2018.' },
      { q: 'Fournissez-vous les certificats avec les produits ?', a: 'Oui. Chaque livraison inclut : déclaration de conformité CE, rapport d\'essai, certificat matière (sur demande), et manuel d\'utilisation. Les certificats sont également téléchargeables depuis votre espace client.' },
      { q: 'Vos produits sont-ils compatibles OTAN ?', a: 'Nos équipements militaires (barres NH90, Gazelle, Panther) sont certifiés AQAP 2110 et peuvent être référencés NATO Stock Number (NSN). Contactez-nous pour la documentation OTAN.' },
      { q: 'Comment vérifier l\'authenticité d\'une pièce LLEDO ?', a: 'Chaque pièce porte un numéro de série unique gravé. Utilisez notre page de traçabilité pour vérifier l\'authenticité et consulter l\'historique complet de la pièce.' },
    ],
  },
]

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState('ordering')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', company: '', subject: '', message: '', priority: 'normal' })
  const [ticketSent, setTicketSent] = useState(false)

  const currentFaqs = faqCategories.find(c => c.id === activeCategory)?.faqs || []

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // For now, simulate sending
    await new Promise(r => setTimeout(r, 1000))
    setTicketSent(true)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-gray-950 to-gray-950" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Support</h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              FAQ, assistance technique et formulaire de contact pour toute question sur nos équipements GSE.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Quick contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Phone, title: 'Téléphone', info: '+33 4 42 02 96 74', sub: 'Lun–Ven 8h–18h', color: 'blue', href: 'tel:+33442029674' },
            { icon: Mail, title: 'Email', info: 'contact@mpeb13.com', sub: 'Réponse sous 24h', color: 'green', href: 'mailto:contact@mpeb13.com' },
            { icon: Clock, title: 'Urgence AOG', info: '+33 6 XX XX XX XX', sub: '24/7 pour AOG', color: 'red', href: 'tel:+33600000000' },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className={`bg-gray-900 border border-gray-800 hover:border-${item.color}-500/30 rounded-xl p-5 flex items-center gap-4 transition-colors group`}
            >
              <div className={`w-11 h-11 bg-${item.color}-500/10 rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-5 h-5 text-${item.color}-400`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{item.info}</p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6">Questions fréquentes</h2>

            {/* Category tabs */}
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 mb-6">
              {faqCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenFaq(null) }}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                    activeCategory === cat.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-2">
              {currentFaqs.map((faq, i) => {
                const key = `${activeCategory}-${i}`
                const isOpen = openFaq === key
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : key)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4 text-sm text-gray-400 leading-relaxed border-t border-gray-800 pt-3">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Ticket Form */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Ouvrir un ticket</h2>
            {ticketSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 border border-green-500/30 rounded-xl p-6 text-center"
              >
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Ticket envoyé</h3>
                <p className="text-sm text-gray-400 mb-4">Notre équipe vous répondra sous 24h ouvrées.</p>
                <button
                  onClick={() => { setTicketSent(false); setTicketForm({ name: '', email: '', company: '', subject: '', message: '', priority: 'normal' }) }}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Envoyer un autre ticket
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={e => setTicketForm({ ...ticketForm, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={e => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Société</label>
                  <input
                    type="text"
                    value={ticketForm.company}
                    onChange={e => setTicketForm({ ...ticketForm, company: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Sujet *</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.subject}
                    onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Ex: Problème fusible barre H160..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Priorité</label>
                  <select
                    value={ticketForm.priority}
                    onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="low">Basse</option>
                    <option value="normal">Normale</option>
                    <option value="high">Haute</option>
                    <option value="aog">AOG — Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketForm.message}
                    onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Documentation', desc: 'Manuels, fiches techniques, bulletins de service', href: '/boutique/documentation', icon: MessageSquare },
            { title: 'Traçabilité', desc: 'Vérifier une pièce par numéro de série', href: '/boutique/tracabilite', icon: Shield },
            { title: 'Certifications', desc: 'Nos certifications qualité et conformité', href: '/boutique/certifications', icon: CheckCircle },
          ].map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 group transition-colors"
            >
              <link.icon className="w-6 h-6 text-indigo-400 mb-3" />
              <h3 className="font-semibold text-white text-sm group-hover:text-indigo-400 transition-colors">{link.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
