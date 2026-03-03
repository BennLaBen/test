'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Search, Filter, Book, Wrench, Shield, ClipboardList, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface DocItem {
  id: string
  title: string
  type: 'manual' | 'datasheet' | 'certificate' | 'bulletin'
  product?: string
  sku?: string
  description: string
  fileSize: string
  date: string
}

const docTypes = [
  { id: 'all', label: 'Tous', icon: FileText },
  { id: 'manual', label: 'Manuels', icon: Book },
  { id: 'datasheet', label: 'Fiches techniques', icon: ClipboardList },
  { id: 'certificate', label: 'Certificats', icon: Shield },
  { id: 'bulletin', label: 'Bulletins de service', icon: Wrench },
]

// Static docs for now — will be replaced by ProductDocument API
const staticDocs: DocItem[] = [
  { id: 'man-h160', title: 'Manuel d\'utilisation — Barre de Remorquage H160', type: 'manual', product: 'Barre H160', sku: 'BR-H160', description: 'Instructions d\'utilisation, d\'entretien et de sécurité pour la barre de remorquage H160.', fileSize: '2.4 MB', date: '2025-11' },
  { id: 'ds-h160', title: 'Fiche technique — Barre de Remorquage H160', type: 'datasheet', product: 'Barre H160', sku: 'BR-H160', description: 'Spécifications techniques complètes, dimensions, matériaux, capacités.', fileSize: '1.1 MB', date: '2025-11' },
  { id: 'cert-ce-h160', title: 'Déclaration de conformité CE — BR-H160', type: 'certificate', product: 'Barre H160', sku: 'BR-H160', description: 'Déclaration CE conforme à la Directive Machines 2006/42/CE.', fileSize: '340 KB', date: '2025-10' },
  { id: 'man-nh90', title: 'Manuel d\'utilisation — Barre de Remorquage NH90', type: 'manual', product: 'Barre NH90', sku: 'BR-NH90-01', description: 'Instructions d\'utilisation militaire, procédures pont d\'envol, maintenance.', fileSize: '3.8 MB', date: '2025-09' },
  { id: 'ds-nh90', title: 'Fiche technique — Barre NH90', type: 'datasheet', product: 'Barre NH90', sku: 'BR-NH90-01', description: 'Specs complètes incluant résistance corrosion marine et capacités.', fileSize: '1.5 MB', date: '2025-09' },
  { id: 'cert-aqap-nh90', title: 'Certificat AQAP 2110 — Gamme militaire', type: 'certificate', description: 'Certificat d\'assurance qualité OTAN pour la production d\'équipements de défense.', fileSize: '520 KB', date: '2025-06' },
  { id: 'sb-001', title: 'SB-2025-001 — Mise à jour fusible de cisaillement', type: 'bulletin', description: 'Bulletin de service : remplacement du fusible de cisaillement (réf. FUSE-V2) sur les barres de remorquage série 2024.', fileSize: '890 KB', date: '2025-08' },
  { id: 'man-roller', title: 'Manuel d\'utilisation — Rollers Hydrauliques H125', type: 'manual', product: 'Rollers H125', sku: 'RL-R125', description: 'Guide complet d\'utilisation et de maintenance préventive des rollers hydrauliques.', fileSize: '2.1 MB', date: '2025-07' },
  { id: 'ds-roller', title: 'Fiche technique — Rollers Hydrauliques H125', type: 'datasheet', product: 'Rollers H125', sku: 'RL-R125', description: 'Capacité de levage, course hydraulique, dimensions, poids.', fileSize: '980 KB', date: '2025-07' },
  { id: 'cert-iso9001', title: 'Certificat ISO 9001:2015', type: 'certificate', description: 'Système de management qualité — Bureau Veritas.', fileSize: '280 KB', date: '2025-03' },
  { id: 'cert-en9100', title: 'Certificat EN 9100:2018', type: 'certificate', description: 'SMQ aéronautique, spatial et défense — Bureau Veritas.', fileSize: '310 KB', date: '2025-03' },
  { id: 'sb-002', title: 'SB-2025-002 — Inspection roues pivotantes', type: 'bulletin', description: 'Bulletin : inspection et remplacement des roues pivotantes sur barres série H175/B332 après 500 cycles.', fileSize: '650 KB', date: '2025-10' },
]

const typeIcons: Record<string, { icon: any; color: string; bg: string }> = {
  manual: { icon: Book, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  datasheet: { icon: ClipboardList, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  certificate: { icon: Shield, color: 'text-green-400', bg: 'bg-green-500/10' },
  bulletin: { icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10' },
}

export default function DocumentationPage() {
  const [filterType, setFilterType] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = staticDocs.filter(doc => {
    if (filterType !== 'all' && doc.type !== filterType) return false
    if (search) {
      const q = search.toLowerCase()
      if (!doc.title.toLowerCase().includes(q) && !doc.description.toLowerCase().includes(q) && !(doc.sku || '').toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-gray-950 to-gray-950" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Centre de documentation
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Accédez aux manuels d&apos;utilisation, fiches techniques, certificats et bulletins de service
              de tous nos équipements GSE.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un document, une référence..."
              className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            {docTypes.map(dt => (
              <button
                key={dt.id}
                onClick={() => setFilterType(dt.id)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  filterType === dt.id ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <dt.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{dt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Manuels', count: staticDocs.filter(d => d.type === 'manual').length, color: 'blue' },
            { label: 'Fiches techniques', count: staticDocs.filter(d => d.type === 'datasheet').length, color: 'cyan' },
            { label: 'Certificats', count: staticDocs.filter(d => d.type === 'certificate').length, color: 'green' },
            { label: 'Bulletins', count: staticDocs.filter(d => d.type === 'bulletin').length, color: 'amber' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold text-${s.color}-400`}>{s.count}</p>
            </div>
          ))}
        </div>

        {/* Document List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucun document trouvé</p>
            </div>
          ) : (
            filtered.map((doc, i) => {
              const ti = typeIcons[doc.type]
              const Icon = ti.icon
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 md:p-5 flex items-center gap-4 group transition-colors"
                >
                  <div className={`w-11 h-11 ${ti.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${ti.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{doc.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{doc.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500">
                      {doc.sku && <span className="font-mono">{doc.sku}</span>}
                      <span>{doc.fileSize}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                </motion.div>
              )
            })
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gray-900 border border-gray-800 rounded-xl p-6 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Document manquant ? Besoin d&apos;une documentation spécifique pour un appel d&apos;offres ?
          </p>
          <Link href="/contact" className="inline-flex px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
            Demander un document
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
