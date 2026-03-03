'use client'

import { motion } from 'framer-motion'
import { Shield, Globe, AlertTriangle, FileText, Lock, Scale, ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const regulations = [
  {
    id: 'directive-machines',
    title: 'Directive Machines 2006/42/CE',
    scope: 'Union Européenne',
    description: 'Tous nos équipements GSE sont conformes aux exigences essentielles de santé et de sécurité de la Directive Machines. Chaque produit est accompagné d\'une déclaration de conformité CE et d\'un manuel d\'utilisation dans la langue du pays de destination.',
    status: 'compliant',
    documents: ['Déclaration de conformité CE', 'Notice technique', 'Analyse de risques'],
    icon: Shield,
    color: 'blue',
  },
  {
    id: 'reach',
    title: 'Règlement REACH (CE 1907/2006)',
    scope: 'Union Européenne',
    description: 'Nos produits sont conformes au règlement REACH. Aucune substance de la liste candidate (SVHC) n\'est présente au-delà des seuils réglementaires. Les fiches de données de sécurité (FDS) sont disponibles sur demande.',
    status: 'compliant',
    documents: ['Attestation REACH', 'Fiches données sécurité'],
    icon: FileText,
    color: 'green',
  },
  {
    id: 'export-control',
    title: 'Contrôle des exportations (Règlement UE 2021/821)',
    scope: 'International',
    description: 'Certains de nos équipements destinés à un usage militaire ou dual sont soumis au contrôle des exportations. Nous disposons des autorisations nécessaires délivrées par le SBDU (Service des Biens à Double Usage) et la DGA.',
    status: 'controlled',
    documents: ['Classement ECN', 'Licence d\'exportation (sur demande)'],
    icon: Globe,
    color: 'amber',
  },
  {
    id: 'itar',
    title: 'ITAR (International Traffic in Arms Regulations)',
    scope: 'États-Unis',
    description: 'Les composants d\'origine américaine intégrés dans nos équipements militaires sont soumis à la réglementation ITAR. Toute réexportation nécessite l\'accord préalable du Département d\'État américain. Notre équipe export vérifie systématiquement la conformité ITAR avant chaque livraison.',
    status: 'applicable',
    documents: ['Vérification ITAR', 'End-User Certificate (EUC)'],
    icon: Lock,
    color: 'red',
  },
  {
    id: 'ear',
    title: 'EAR (Export Administration Regulations)',
    scope: 'États-Unis',
    description: 'Les biens à double usage (civil/militaire) peuvent être soumis aux EAR. Nous vérifions systématiquement les listes de contrôle (Entity List, SDN List) avant toute transaction internationale.',
    status: 'applicable',
    documents: ['Screening report', 'ECCN classification'],
    icon: Scale,
    color: 'purple',
  },
  {
    id: 'sanctions',
    title: 'Sanctions internationales (ONU, UE, OFAC)',
    scope: 'International',
    description: 'LLEDO Aerotools applique strictement les régimes de sanctions internationaux. Chaque client et destination est vérifié contre les listes de sanctions de l\'ONU, de l\'UE et de l\'OFAC avant toute livraison.',
    status: 'enforced',
    documents: ['Politique de conformité sanctions', 'Procédure KYC'],
    icon: AlertTriangle,
    color: 'amber',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
}

const statusLabels: Record<string, { label: string; color: string }> = {
  compliant: { label: 'Conforme', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  controlled: { label: 'Contrôlé', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  applicable: { label: 'Applicable', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  enforced: { label: 'Appliqué', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
}

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Conformité &amp; Export Control
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              LLEDO Aerotools s&apos;engage à respecter strictement les réglementations nationales et
              internationales en matière de contrôle des exportations, sanctions et conformité produit.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Regulations */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-5">
          {regulations.map((reg, index) => {
            const colors = colorMap[reg.color]
            const status = statusLabels[reg.status]
            const Icon = reg.icon
            return (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`bg-gray-900 border ${colors.border} rounded-xl p-6 md:p-8`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-white">{reg.title}</h2>
                      <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border uppercase ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-500">{reg.scope}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{reg.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {reg.documents.map(doc => (
                        <span key={doc} className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <FileText className="w-3 h-3 text-gray-500" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Processus de vérification export</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Classification', desc: 'Détermination ECCN / ML du produit' },
              { step: '02', title: 'Screening', desc: 'Vérification client & destination (listes de sanctions)' },
              { step: '03', title: 'Licence', desc: 'Obtention de la licence export si nécessaire' },
              { step: '04', title: 'Documentation', desc: 'EUC, certificat d\'utilisation finale, traçabilité' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4 relative">
                <span className="text-3xl font-bold text-gray-800 absolute top-3 right-3">{item.step}</span>
                <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Pour toute question relative à la conformité export ou pour obtenir un document spécifique :
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
              Contacter le service export
            </Link>
            <Link href="/boutique/certifications" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              Voir nos certifications
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
