'use client'

import { motion } from 'framer-motion'
import { Shield, Download, CheckCircle, FileText, Award, Globe, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const certifications = [
  {
    id: 'en9100',
    title: 'EN 9100:2018',
    subtitle: 'Système de Management Qualité Aéronautique',
    description: 'Certification qualité spécifique à l\'industrie aéronautique, spatiale et défense. Garantit la conformité des processus de conception, fabrication et livraison aux exigences les plus strictes du secteur.',
    status: 'active',
    validUntil: '2027-03-15',
    scope: 'Conception et fabrication d\'outillage sol pour hélicoptères',
    body: 'Bureau Veritas',
    icon: Award,
    color: 'blue',
  },
  {
    id: 'iso9001',
    title: 'ISO 9001:2015',
    subtitle: 'Système de Management Qualité',
    description: 'Certification internationale attestant d\'un système de management qualité efficace, orienté satisfaction client et amélioration continue.',
    status: 'active',
    validUntil: '2027-03-15',
    scope: 'Conception, fabrication et commercialisation d\'équipements industriels',
    body: 'Bureau Veritas',
    icon: CheckCircle,
    color: 'green',
  },
  {
    id: 'ce',
    title: 'Marquage CE',
    subtitle: 'Conformité Européenne',
    description: 'Tous nos équipements sont conformes aux directives européennes applicables, notamment la Directive Machines 2006/42/CE. Le marquage CE atteste de la conformité aux exigences essentielles de santé et de sécurité.',
    status: 'active',
    validUntil: null,
    scope: 'Tous les équipements GSE commercialisés',
    body: 'Auto-certification + organisme notifié',
    icon: Shield,
    color: 'purple',
  },
  {
    id: 'aqap2110',
    title: 'AQAP 2110',
    subtitle: 'Assurance Qualité OTAN',
    description: 'Publication Alliée d\'Assurance Qualité pour la conception, le développement et la production. Requise pour les contrats de défense dans le cadre de l\'OTAN.',
    status: 'active',
    validUntil: '2026-12-01',
    scope: 'Équipements destinés aux forces armées',
    body: 'DGA / Direction Générale de l\'Armement',
    icon: Globe,
    color: 'amber',
  },
  {
    id: 'iso3834',
    title: 'EN ISO 3834-2',
    subtitle: 'Exigences de qualité en soudage par fusion',
    description: 'Certification attestant de la maîtrise complète des procédés de soudage. Niveau 2 (complet) — le plus exigeant. Essentiel pour la fabrication d\'outillage structurel aéronautique.',
    status: 'active',
    validUntil: '2026-09-30',
    scope: 'Soudage des structures principales (barres de remorquage, châssis rollers)',
    body: 'Institut de Soudure',
    icon: FileText,
    color: 'cyan',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', badge: 'bg-green-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', badge: 'bg-purple-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', badge: 'bg-amber-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', badge: 'bg-cyan-500' },
}

export default function CertificationsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-gray-950 to-gray-950" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-medium tracking-wider uppercase">Confiance & Conformité</p>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Nos Certifications
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              LLEDO Aerotools opère selon les standards les plus exigeants de l&apos;industrie
              aéronautique. Chaque produit est conçu, fabriqué et livré dans le respect de ces certifications.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {certifications.map((cert, index) => {
            const colors = colorMap[cert.color]
            const Icon = cert.icon
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-gray-900 border ${colors.border} rounded-xl overflow-hidden`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-white">{cert.title}</h2>
                        <span className={`px-2.5 py-0.5 ${colors.badge} text-white text-xs font-semibold rounded-full uppercase`}>
                          Actif
                        </span>
                      </div>
                      <p className={`text-sm ${colors.text} font-medium mb-3`}>{cert.subtitle}</p>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{cert.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Périmètre</p>
                          <p className="text-gray-300">{cert.scope}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Organisme</p>
                          <p className="text-gray-300">{cert.body}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Validité</p>
                          <p className="text-gray-300">
                            {cert.validUntil
                              ? new Date(cert.validUntil).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                              : 'Permanente'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Download button */}
                    <div className="flex-shrink-0">
                      <button
                        className={`flex items-center gap-2 px-4 py-2.5 ${colors.bg} ${colors.text} border ${colors.border} rounded-lg text-sm font-medium hover:bg-opacity-20 transition-colors`}
                      >
                        <Download className="w-4 h-4" />
                        Certificat PDF
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Compliance Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Conformité Export & ITAR</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Certains de nos équipements sont soumis à la réglementation sur le contrôle des exportations.
                Les produits destinés à un usage militaire peuvent nécessiter une autorisation d&apos;exportation
                délivrée par les autorités compétentes (DGA, BIS). Contactez notre service export pour toute
                commande internationale.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Contacter le service export →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Besoin d&apos;un certificat spécifique ou d&apos;une documentation qualité pour un appel d&apos;offres ?
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/boutique/devis"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
            >
              Demander un devis
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
