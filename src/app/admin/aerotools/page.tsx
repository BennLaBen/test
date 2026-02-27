'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown, Download, Upload, RotateCcw,
  Search, Edit3, X, Save, AlertTriangle, Package, Check, ImageIcon,
  Truck, RotateCw, Wrench, Settings2, ExternalLink, Film, Loader2, FolderOpen
} from 'lucide-react'
import { useProductAdmin, emptyProduct, validateProduct } from '@/lib/shop/useProductAdmin'
import type { ShopProduct } from '@/lib/shop/types'
import Link from 'next/link'

/* ═══════════════════════════════════════════════════════
   TYPES DE PRODUITS — Distinction claire Barre / Rollers
   ═══════════════════════════════════════════════════════ */
const PRODUCT_TYPES = [
  { id: 'towing', label: 'Barre de Remorquage', icon: Truck, color: 'blue' },
  { id: 'handling', label: 'Rollers Hydrauliques', icon: RotateCw, color: 'cyan' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'amber' },
  { id: 'gse', label: 'Équipement Sol (GSE)', icon: Settings2, color: 'purple' },
]

/* ═══════════════════════════════════════════════════════
   LISTE COMPLÈTE DES HÉLICOPTÈRES (cliquable)
   ═══════════════════════════════════════════════════════ */
const ALL_HELICOPTERS = [
  { id: 'H120', label: 'H120 / EC120', family: 'Airbus Léger', image: '/images/aerotools/helicopters/h120.jpg' },
  { id: 'H125', label: 'H125 / AS350 Écureuil', family: 'Airbus Léger', image: '/images/aerotools/helicopters/h125.jpg' },
  { id: 'H130', label: 'H130 / EC130', family: 'Airbus Léger', image: '/images/aerotools/helicopters/h130.jpg' },
  { id: 'H135', label: 'H135 / EC135', family: 'Airbus Léger', image: '/images/aerotools/helicopters/h135.jpg' },
  { id: 'H145', label: 'H145 / EC145', family: 'Airbus Moyen', image: '/images/aerotools/helicopters/h145.jpg' },
  { id: 'H160', label: 'H160', family: 'Airbus Moyen', image: '/images/aerotools/helicopters/h160.jpg' },
  { id: 'H175', label: 'H175', family: 'Airbus Lourd', image: '/images/aerotools/helicopters/h175.jpg' },
  { id: 'SA365', label: 'SA365 Dauphin', family: 'Airbus Moyen', image: '/images/aerotools/helicopters/sa365.jpg' },
  { id: 'AS565', label: 'AS565 Panther', family: 'Airbus Militaire', image: '/images/aerotools/helicopters/as565.jpg' },
  { id: 'Gazelle', label: 'SA341/342 Gazelle', family: 'Aérospatiale', image: '/images/aerotools/helicopters/gazelle.jpg' },
  { id: 'SA330', label: 'SA330 Puma', family: 'Airbus Lourd', image: '/images/aerotools/helicopters/sa330.jpg' },
  { id: 'AS332', label: 'AS332 Super Puma', family: 'Airbus Lourd', image: '/images/aerotools/helicopters/as332.jpg' },
  { id: 'AS532', label: 'AS532 Cougar', family: 'Airbus Militaire', image: '/images/aerotools/helicopters/as532.jpg' },
  { id: 'H215', label: 'H215', family: 'Airbus Lourd', image: '/images/aerotools/helicopters/h215.jpg' },
  { id: 'H225', label: 'H225 / EC225', family: 'Airbus Lourd', image: '/images/aerotools/helicopters/h225.jpg' },
  { id: 'EC725', label: 'EC725 Caracal', family: 'Airbus Militaire', image: '/images/aerotools/helicopters/h225m.jpg' },
  { id: 'NH90', label: 'NH90', family: 'NHIndustries Militaire', image: '/images/aerotools/helicopters/nh90.jpg' },
  { id: 'AW109', label: 'AW109', family: 'Leonardo', image: '/images/aerotools/helicopters/aw109.jpg' },
  { id: 'AW119', label: 'AW119', family: 'Leonardo', image: '/images/aerotools/helicopters/aw119.jpg' },
  { id: 'AW139', label: 'AW139', family: 'Leonardo', image: '/images/aerotools/helicopters/aw139.jpg' },
]

/* ═══════════════════════════════════════════════════════
   LISTES PRÉDÉFINIES — Pour chaque champ
   ═══════════════════════════════════════════════════════ */
const PREDEFINED_FEATURES: Record<string, string[]> = {
  towing: [
    'Système de verrouillage rapide double sécurité',
    'Amortisseur de chocs intégré',
    'Roues pivotantes haute résistance',
    'Fusible de cisaillement calibré',
    'Accrochage rapide breveté',
    'Utilisation mono-opérateur',
    'Commande de verrouillage déportée',
    'Fusibles de traction & torsion',
    'Hauteur réglable — 3 positions',
    'Amortisseur de timon',
    'Repliable pour transport aisé',
    'Traitement anti-corrosion marine',
    'Peinture résistante Skydrol',
    'Compatible FLIR & perche de ravitaillement',
    'Version militaire avec cornes',
    'Polyvalente — compatible tous hélicos légers à patins',
    'Ultra-légère (structure alu)',
    'Mise en place par un seul opérateur',
  ],
  handling: [
    'Levage hydraulique manuel ou électrique',
    'Frein de parc positif',
    'Garde au sol réglable',
    'Adaptation rapide sur patins',
    'Double vérin de levage',
    'Pompe à double vitesse',
    'Utilisation debout & pompage au pied',
    'Format compact — stockage dans l\'appareil',
    'Barre démontable en deux parties',
    'Barre démontable anti-retour sécurisé',
    'Ultra-compact — faible encombrement',
    'Roues démontables',
    'Couleur de capot personnalisable',
    'Ergonomie améliorée — pénibilité réduite',
  ],
  maintenance: [
    'Coffret ABS renforcé IP67',
    'Outillage calibré et repéré',
    'Clés dynamométriques incluses',
    'Hauteur réglable 800-1400 mm',
    'Plateau rotatif 360°',
    'Pieds stabilisateurs escamotables',
    'Tissu Cordura 1000D',
    'Mousse EVA haute densité',
    'Fixation Velcro ajustable',
  ],
  gse: [
    'Sortie 28V DC stabilisée',
    'Courant crête 1500A',
    'Fonctionnement silencieux <65 dB',
    'Roulettes et timon de transport',
    'Levage synchronisé 3 points',
    'Commande centralisée hydraulique',
    'Indicateurs de charge individuels',
    'Pieds auto-nivelants',
  ],
}

const PREDEFINED_CERTIFICATIONS = [
  'CE',
  'EN 12312-1',
  'Directive Machines 2006/42/CE',
  'EN 1915-1',
  'EN 9100',
  'ISO 9001:2015',
  'ISO 9667',
  'AQAP 2110',
  'STANAG compatible',
]

const PREDEFINED_APPLICATIONS: Record<string, string[]> = {
  towing: [
    'Tractage sur piste et taxiway',
    'Manœuvre en hangar de maintenance',
    'Opérations hélistation offshore',
    'Positionnement précis sur aire de stationnement',
    'Tractage sur pont d\'envol (frégate, BPC)',
    'Transport déployable — repliable sans outillage',
    'Tractage AW139 sur piste et héliport',
    'Recherche et sauvetage (SAR)',
    'Transport VIP et HEMS',
  ],
  handling: [
    'Mise sur roues pour maintenance hangar',
    'Déplacement sur aire de stationnement',
    'Repositionnement en espace restreint',
    'Opérations de pesée hélicoptère',
    'Roulage piste hélicoptères à patins',
    'Stockage compact dans l\'appareil',
    'Opérations mono-opérateur',
    'Utilisation sous panier — espace restreint',
  ],
  maintenance: [
    'Maintenance de premier niveau (ligne de vol)',
    'Visite périodique 100h / 600h',
    'Dépannage sur site client',
    'Formation techniciens en atelier-école',
  ],
  gse: [
    'Démarrage moteur au sol',
    'Alimentation maintenance',
    'Levage complet hélicoptère',
    'Opérations offshore',
  ],
}

const USAGE_OPTIONS = [
  { id: 'civil', label: 'Civil' },
  { id: 'military', label: 'Militaire' },
  { id: 'offshore', label: 'Offshore' },
  { id: 'sar', label: 'SAR' },
  { id: 'naval', label: 'Naval' },
]

const SPEC_FIELDS: Record<string, { key: string; label: string; placeholder: string }[]> = {
  towing: [
    { key: 'Compatibilité', label: 'Hélicoptère compatible', placeholder: 'Airbus H160' },
    { key: 'Poids', label: 'Poids', placeholder: '40 kg env.' },
    { key: 'Longueur', label: 'Longueur', placeholder: '3352 mm' },
    { key: 'Matériau', label: 'Matériau principal', placeholder: 'Aluminium aéronautique' },
    { key: 'Capacité traction', label: 'Capacité de traction', placeholder: '1720 daN' },
    { key: 'Capacité virage', label: 'Capacité en virage', placeholder: '1865 Nm' },
    { key: 'Certifications', label: 'Certifications', placeholder: 'CE, ISO 9667' },
  ],
  handling: [
    { key: 'Compatibilité', label: 'Hélicoptère compatible', placeholder: 'AS350 / H125' },
    { key: 'Poids', label: 'Poids', placeholder: '25 kg env.' },
    { key: 'Charge Max', label: 'Charge maximale', placeholder: '3 200 kg' },
    { key: 'Levée', label: 'Hauteur de levée', placeholder: '120 mm' },
    { key: 'Type', label: 'Type de levage', placeholder: 'Hydraulique manuel' },
    { key: 'Roues', label: 'Type de roues', placeholder: 'Polyuréthane Ø125 mm' },
    { key: 'Matériau', label: 'Matériau principal', placeholder: 'Acier traité + alu' },
  ],
  maintenance: [
    { key: 'Compatibilité', label: 'Hélicoptère compatible', placeholder: 'H125 / Famille Écureuil' },
    { key: 'Poids total', label: 'Poids total', placeholder: '18 kg' },
    { key: 'Contenu', label: 'Contenu du kit', placeholder: '47 outils' },
    { key: 'Norme', label: 'Norme', placeholder: 'Conforme Airbus SB' },
    { key: 'Matériau', label: 'Matériau', placeholder: 'Acier Chrome-Vanadium' },
  ],
  gse: [
    { key: 'Tension', label: 'Tension de sortie', placeholder: '28V DC' },
    { key: 'Courant continu', label: 'Courant continu', placeholder: '600A' },
    { key: 'Courant crête', label: 'Courant crête', placeholder: '1500A' },
    { key: 'Poids', label: 'Poids', placeholder: '85 kg' },
    { key: 'Dimensions', label: 'Dimensions (L×l×H)', placeholder: '800 × 500 × 600 mm' },
    { key: 'Bruit', label: 'Niveau sonore', placeholder: '<65 dB' },
  ],
}

/* ═══════════════════════════════════════════════════════
   COMPOSANT : Sélecteur d'hélicoptères (grille cliquable)
   ═══════════════════════════════════════════════════════ */
function HelicopterPicker({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(x => x !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const families = useMemo(() => {
    const map = new Map<string, typeof ALL_HELICOPTERS>()
    ALL_HELICOPTERS.forEach(h => {
      const list = map.get(h.family) || []
      list.push(h)
      map.set(h.family, list)
    })
    return Array.from(map.entries())
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-white">Hélicoptères compatibles</p>
        <span className="text-xs text-blue-400 font-bold">{selected.length} sélectionné{selected.length > 1 ? 's' : ''}</span>
      </div>
      <p className="text-xs text-gray-500 mb-4">Cliquez sur les hélicoptères compatibles avec ce produit :</p>

      {families.map(([family, helis]) => (
        <div key={family} className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-800 pb-1">{family}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {helis.map(h => {
              const isSelected = selected.includes(h.id)
              return (
                <button
                  key={h.id}
                  onClick={() => toggle(h.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600/10'
                      : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                    <Image src={h.image} alt={h.label} width={48} height={48} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-300' : 'text-white'}`}>{h.id}</p>
                    <p className="text-[10px] text-gray-500 truncate">{h.label}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <button
        onClick={() => onChange(selected.length === ALL_HELICOPTERS.length ? [] : ALL_HELICOPTERS.map(h => h.id))}
        className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-700 text-sm font-bold text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
      >
        {selected.length === ALL_HELICOPTERS.length ? 'Tout désélectionner' : 'Tout sélectionner'}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPOSANT : Sélecteur par liste prédéfinie (chips)
   ═══════════════════════════════════════════════════════ */
function ChipPicker({ selected, options, onChange, label, description }: {
  selected: string[]
  options: string[]
  onChange: (v: string[]) => void
  label: string
  description?: string
}) {
  const [custom, setCustom] = useState('')

  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(x => x !== opt))
    } else {
      onChange([...selected, opt])
    }
  }

  const addCustom = () => {
    const val = custom.trim()
    if (!val || selected.includes(val)) return
    onChange([...selected, val])
    setCustom('')
  }

  return (
    <div>
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}

      <div className="flex flex-wrap gap-2 mb-3">
        {options.map(opt => {
          const isSelected = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                isSelected
                  ? 'border-blue-500 bg-blue-600/15 text-blue-300'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              {isSelected && <Check className="h-3 w-3 inline mr-1.5" />}
              {opt}
            </button>
          )
        })}
      </div>

      {/* Affichage de ceux sélectionnés qui ne sont pas dans la liste prédéfinie */}
      {selected.filter(s => !options.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selected.filter(s => !options.includes(s)).map(s => (
            <span key={s} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-900/20 border border-green-500/30 rounded-lg text-xs font-medium text-green-300">
              {s}
              <button onClick={() => onChange(selected.filter(x => x !== s))} className="text-green-500/50 hover:text-red-400 ml-1">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text" value={custom} onChange={e => setCustom(e.target.value)}
          placeholder="Ajouter un élément personnalisé..."
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500"
        />
        <button onClick={addCustom} className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-bold hover:bg-blue-600/30">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPOSANT : Spécifications techniques (champs prédéfinis)
   ═══════════════════════════════════════════════════════ */
function SpecsEditor({ specs, category, onChange }: {
  specs: Record<string, string>
  category: string
  onChange: (s: Record<string, string>) => void
}) {
  const fields = SPEC_FIELDS[category] || SPEC_FIELDS.towing
  const [extraKey, setExtraKey] = useState('')
  const [extraVal, setExtraVal] = useState('')

  const updateField = (key: string, value: string) => {
    onChange({ ...specs, [key]: value })
  }

  const removeField = (key: string) => {
    const next = { ...specs }
    delete next[key]
    onChange(next)
  }

  const addExtra = () => {
    if (!extraKey.trim()) return
    onChange({ ...specs, [extraKey.trim()]: extraVal.trim() })
    setExtraKey('')
    setExtraVal('')
  }

  const extraEntries = Object.entries(specs).filter(
    ([key]) => !fields.some(f => f.key === key)
  )

  return (
    <div>
      <p className="text-sm font-bold text-white mb-1">Données techniques</p>
      <p className="text-xs text-gray-500 mb-4">Remplissez les champs ci-dessous. Laissez vide si non applicable.</p>

      <div className="space-y-3 mb-4">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs font-bold text-gray-400 mb-1 block">{f.label}</label>
            <input
              type="text"
              value={specs[f.key] || ''}
              onChange={e => updateField(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Extra specs */}
      {extraEntries.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Spécifications supplémentaires</p>
          {extraEntries.map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 bg-gray-800/50 rounded-xl px-4 py-2">
              <span className="text-xs text-gray-400 font-bold flex-shrink-0 min-w-[100px]">{key}</span>
              <input
                type="text" value={val}
                onChange={e => updateField(key, e.target.value)}
                className="flex-1 px-2 py-1 bg-transparent border-b border-gray-700 text-sm text-white outline-none focus:border-blue-500"
              />
              <button onClick={() => removeField(key)} className="text-gray-600 hover:text-red-400 p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input type="text" value={extraKey} onChange={e => setExtraKey(e.target.value)}
          placeholder="Nom du champ" className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500" />
        <input type="text" value={extraVal} onChange={e => setExtraVal(e.target.value)}
          placeholder="Valeur" onKeyDown={e => e.key === 'Enter' && addExtra()}
          className="flex-1 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500" />
        <button onClick={addExtra} className="px-4 py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 text-sm font-bold hover:bg-blue-600/30">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPOSANT : Image principale avec upload
   ═══════════════════════════════════════════════════════ */
function MainImageUploader({ image, onChange }: { image: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'aerotools')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) onChange(data.url)
    } catch { /* silent */ }
    setUploading(false)
  }

  return (
    <div>
      <p className="text-sm font-bold text-white mb-1">Image principale</p>
      <p className="text-xs text-gray-500 mb-3">L&apos;image qui apparaît dans la liste des produits</p>

      {image ? (
        <div className="relative w-full min-h-[120px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Image principale" className="w-full h-auto max-h-[300px] object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <p className="text-xs text-gray-500 text-center py-2 truncate px-4">{image}</p>
          <div className="absolute top-2 right-2 flex gap-2">
            <button onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 bg-blue-600/90 text-white rounded-lg text-xs font-bold hover:bg-blue-500 backdrop-blur-sm">
              Changer
            </button>
            <button onClick={() => onChange('')}
              className="p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-500 backdrop-blur-sm">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="w-full aspect-video bg-gray-800/30 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors mb-3"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          ) : (
            <>
              <FolderOpen className="h-8 w-8 text-gray-500 mb-2" />
              <p className="text-sm font-bold text-gray-400">Cliquez pour choisir une image</p>
              <p className="text-[10px] text-gray-600 mt-1">JPG, PNG, WEBP</p>
            </>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = '' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPOSANT : Galerie médias (images + vidéos) avec upload
   ═══════════════════════════════════════════════════════ */
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.wmv']
function isVideoUrl(url: string) {
  return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext)) || url.toLowerCase().includes('video')
}

function MediaGalleryEditor({ media, onChange }: { media: string[]; onChange: (m: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<number[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    setError(null)
    const fileArray = Array.from(files)
    const startIndex = media.length

    // Add placeholder entries for each file being uploaded
    const placeholders = fileArray.map(() => '')
    onChange([...media, ...placeholders])
    setUploading(fileArray.map((_, i) => startIndex + i))

    const results: { index: number; url: string }[] = []
    const errors: string[] = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'aerotools')

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.success) {
          results.push({ index: startIndex + i, url: data.url })
        } else {
          errors.push(`${file.name}: ${data.error}`)
        }
      } catch {
        errors.push(`${file.name}: Erreur réseau`)
      }
    }

    // Build final media array with actual URLs replacing placeholders
    const current = [...media, ...placeholders]
    results.forEach(r => { if (r.index < current.length) current[r.index] = r.url })
    // Remove failed uploads (empty strings at end)
    onChange(current.filter((url, idx) => url !== '' || idx < startIndex))

    setUploading([])
    if (errors.length > 0) setError(errors.join('\n'))
  }, [media, onChange])

  const handleFileSelect = () => fileInputRef.current?.click()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
      e.target.value = ''
    }
  }

  const removeMedia = (index: number) => onChange(media.filter((_, i) => i !== index))

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-bold text-white">Photos & Vidéos du produit</p>
          <p className="text-xs text-gray-500 mt-0.5">{media.filter(u => u).length} fichier{media.filter(u => u).length > 1 ? 's' : ''} ajouté{media.filter(u => u).length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Media grid preview */}
      {media.filter(u => u).length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {media.map((url, i) => {
            if (!url) return (
              <div key={i} className="aspect-square bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
              </div>
            )
            const isVideo = isVideoUrl(url)
            return (
              <div key={i} className="relative group w-full h-[140px] bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                {isVideo ? (
                  <div className="relative w-full h-full">
                    <video src={url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center">
                        <Film className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Média ${i + 1}`} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-[9px] text-gray-500 text-center px-2 truncate w-full">{url.split('/').pop()}</p>
                    </div>
                  </div>
                )}
                {/* Always visible delete button */}
                <div className="absolute top-1.5 right-1.5 z-10">
                  <button onClick={() => removeMedia(i)}
                    className="p-1.5 bg-red-600/90 backdrop-blur-sm rounded-lg text-white hover:bg-red-500 shadow-lg">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                  <span className="text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded-md">#{i + 1}</span>
                  {isVideo && <span className="text-[9px] font-bold bg-purple-600/90 text-white px-1.5 py-0.5 rounded-md">VIDÉO</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Drop zone / Upload button */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative w-full p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          dragOver
            ? 'border-blue-500 bg-blue-600/10'
            : 'border-gray-700 bg-gray-800/30 hover:border-gray-500'
        }`}
        onClick={handleFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-center">
          {uploading.length > 0 ? (
            <>
              <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-sm font-bold text-blue-300">Envoi en cours... ({uploading.length} fichier{uploading.length > 1 ? 's' : ''})</p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-2">
                <FolderOpen className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-base font-bold text-gray-300 mb-1">
                Cliquez pour parcourir vos fichiers
              </p>
              <p className="text-xs text-gray-500">
                ou glissez-déposez vos photos et vidéos ici
              </p>
              <p className="text-[10px] text-gray-600 mt-2">
                Photos : JPG, PNG, WEBP &nbsp;•&nbsp; Vidéos : MP4, WEBM, MOV &nbsp;•&nbsp; Max 200 Mo
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-xl">
          <p className="text-xs text-red-400 font-bold mb-1">Erreur lors de l&apos;envoi :</p>
          <p className="text-xs text-red-300 whitespace-pre-line">{error}</p>
          <button onClick={() => setError(null)} className="text-[10px] text-red-500 underline mt-1">Fermer</button>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   FORMULAIRE PRODUIT (panneau latéral — étapes simples)
   ═══════════════════════════════════════════════════════ */
function ProductForm({ product, onSave, onCancel }: {
  product: ShopProduct
  onSave: (p: ShopProduct) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<ShopProduct>({ ...product })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState(0)

  const set = <K extends keyof ShopProduct>(key: K, value: ShopProduct[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }))
    if (errors[key as string]) {
      setErrors(prev => { const n = { ...prev }; delete n[key as string]; return n })
    }
  }

  const autoSlug = () => {
    if (!draft.slug || draft.slug === product.slug) {
      set('slug', draft.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleSave = () => {
    const validationErrors = validateProduct(draft)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStep(0)
      return
    }
    onSave(draft)
  }

  const steps = [
    { label: '1. Type & Nom', icon: Package },
    { label: '2. Hélicoptères', icon: Truck },
    { label: '3. Caractéristiques', icon: Check },
    { label: '4. Données techniques', icon: Settings2 },
    { label: '5. Photos', icon: ImageIcon },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-gray-900 border-l border-gray-800 flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black uppercase text-white">
                {product.id ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <p className="text-xs text-gray-500">{draft.name || 'Sans nom'}</p>
            </div>
            <button onClick={onCancel} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Steps navigation */}
          <div className="flex gap-1">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <button key={i} onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    step === i
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-500 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ═══ ÉTAPE 1 : Type & Nom ═══ */}
          {step === 0 && (
            <div className="space-y-6">
              {/* Type de produit */}
              <div>
                <p className="text-sm font-bold text-white mb-1">Type de produit</p>
                <p className="text-xs text-gray-500 mb-3">Choisissez le type de produit :</p>
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_TYPES.map(t => {
                    const Icon = t.icon
                    const isActive = draft.category === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => set('category', t.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          isActive
                            ? 'border-blue-500 bg-blue-600/10'
                            : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-600/20' : 'bg-gray-800'}`}>
                          <Icon className={`h-5 w-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                        </div>
                        <span className={`text-sm font-bold ${isActive ? 'text-blue-300' : 'text-gray-300'}`}>{t.label}</span>
                        {isActive && <Check className="h-5 w-5 text-blue-400 ml-auto" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="text-sm font-bold text-white mb-1 block">Nom du produit *</label>
                <input type="text" value={draft.name} onChange={e => set('name', e.target.value)} onBlur={autoSlug}
                  placeholder="Ex: Barre de Remorquage H160"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-base text-white placeholder-gray-600 outline-none ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Description courte */}
              <div>
                <label className="text-sm font-bold text-white mb-1 block">Description courte</label>
                <input type="text" value={draft.shortDescription} onChange={e => set('shortDescription', e.target.value)}
                  placeholder="Ex: Tractage certifié H160 — Verrouillage rapide"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-base text-white placeholder-gray-600 outline-none focus:border-blue-500"
                />
              </div>

              {/* Description complète */}
              <div>
                <label className="text-sm font-bold text-white mb-1 block">Description détaillée *</label>
                <textarea value={draft.description} onChange={e => set('description', e.target.value)}
                  placeholder="Décrivez le produit en détail..."
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-base text-white placeholder-gray-600 outline-none resize-none ${errors.description ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
                />
                {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
              </div>

              {/* Référence & Slug (auto) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1 block">Référence produit</label>
                  <input type="text" value={draft.id} onChange={e => set('id', e.target.value)}
                    placeholder="Auto-généré"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1 block">URL (slug)</label>
                  <input type="text" value={draft.slug} onChange={e => set('slug', e.target.value)}
                    placeholder="barre-remorquage-h160"
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-sm text-white placeholder-gray-600 outline-none ${errors.slug ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
                  />
                </div>
              </div>

              {/* Statut */}
              <div>
                <p className="text-sm font-bold text-white mb-3">Statut du produit</p>
                <div className="flex flex-wrap gap-3">
                  {([['inStock', 'En stock', 'green'], ['isNew', 'Nouveau', 'blue'], ['isFeatured', 'Mis en avant', 'amber']] as const).map(([key, label, color]) => (
                    <button
                      key={key}
                      onClick={() => set(key, !draft[key])}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                        draft[key]
                          ? `border-${color}-500 bg-${color}-600/10 text-${color}-300`
                          : 'border-gray-700 bg-gray-800/30 text-gray-400'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${draft[key] ? `bg-${color}-600 border-${color}-500` : 'border-gray-600'}`}>
                        {draft[key] && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix & délai */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1 block">Prix affiché</label>
                  <input type="text" value={draft.priceDisplay} onChange={e => set('priceDisplay', e.target.value)}
                    placeholder="SUR DEVIS" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-1 block">Délai de livraison</label>
                  <input type="text" value={draft.leadTime || ''} onChange={e => set('leadTime', e.target.value)}
                    placeholder="6 à 8 semaines" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* ═══ ÉTAPE 2 : Hélicoptères ═══ */}
          {step === 1 && (
            <HelicopterPicker selected={draft.compatibility} onChange={v => set('compatibility', v)} />
          )}

          {/* ═══ ÉTAPE 3 : Caractéristiques ═══ */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <p className="text-sm font-bold text-white mb-1">Usage</p>
                <p className="text-xs text-gray-500 mb-3">Pour quel type d&apos;opérations ?</p>
                <div className="flex flex-wrap gap-2">
                  {USAGE_OPTIONS.map(u => {
                    const isActive = draft.usage.includes(u.id)
                    return (
                      <button key={u.id} onClick={() => set('usage', isActive ? draft.usage.filter(x => x !== u.id) : [...draft.usage, u.id])}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                          isActive ? 'border-blue-500 bg-blue-600/10 text-blue-300' : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-500'
                        }`}>
                        {isActive && <Check className="h-3 w-3 inline mr-1.5" />}
                        {u.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <ChipPicker
                selected={draft.features}
                options={PREDEFINED_FEATURES[draft.category] || PREDEFINED_FEATURES.towing}
                onChange={v => set('features', v)}
                label="Caractéristiques du produit"
                description="Sélectionnez les caractéristiques ou ajoutez les vôtres :"
              />

              <ChipPicker
                selected={draft.certifications || []}
                options={PREDEFINED_CERTIFICATIONS}
                onChange={v => set('certifications', v)}
                label="Certifications"
                description="Quelles certifications possède ce produit ?"
              />

              <ChipPicker
                selected={draft.applications || []}
                options={PREDEFINED_APPLICATIONS[draft.category] || PREDEFINED_APPLICATIONS.towing}
                onChange={v => set('applications', v)}
                label="Applications"
                description="Dans quels contextes ce produit est-il utilisé ?"
              />
            </div>
          )}

          {/* ═══ ÉTAPE 4 : Données techniques ═══ */}
          {step === 3 && (
            <SpecsEditor specs={draft.specs} category={draft.category} onChange={v => set('specs', v)} />
          )}

          {/* ═══ ÉTAPE 5 : Photos ═══ */}
          {step === 4 && (
            <div className="space-y-6">
              <MainImageUploader image={draft.image} onChange={v => set('image', v)} />
              <MediaGalleryEditor media={draft.gallery} onChange={v => set('gallery', v)} />

              <div>
                <label className="text-xs font-bold text-gray-400 mb-1 block">Fiche technique PDF (optionnel)</label>
                <input type="text" value={(draft.datasheetUrl as string) || ''} onChange={e => set('datasheetUrl' as any, e.target.value)}
                  placeholder="/docs/fiche-technique.pdf"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer — navigation + save */}
        <div className="flex-shrink-0 bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                ← Précédent
              </button>
            )}
            {step === 0 && (
              <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Annuler
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {step < steps.length - 1 && (
              <button onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors">
                Suivant →
              </button>
            )}
            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-500 transition-colors">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE PRINCIPALE ADMIN AEROTOOLS
   ═══════════════════════════════════════════════════════ */
export default function AdminAerotoolsPage() {
  const { products, loaded, addProduct, updateProduct, deleteProduct, duplicateProduct, reorderProduct, exportJSON, importJSON, resetToDefaults } = useProductAdmin()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [editing, setEditing] = useState<ShopProduct | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (catFilter !== 'all' && p.category !== catFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      }
      return true
    })
  }, [products, search, catFilter])

  const handleSave = (p: ShopProduct) => {
    if (editing?.id && products.some(x => x.id === editing.id)) {
      updateProduct(editing.id, p)
      showToast(`"${p.name}" mis à jour`)
    } else {
      addProduct(p)
      showToast(`"${p.name}" ajouté au catalogue`)
    }
    setEditing(null)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const ok = importJSON(ev.target?.result as string)
      showToast(ok ? `${file.name} importé avec succès` : 'Erreur : format JSON invalide')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const stats = useMemo(() => ({
    barres: products.filter(p => p.category === 'towing').length,
    rollers: products.filter(p => p.category === 'handling').length,
    maintenance: products.filter(p => p.category === 'maintenance').length,
    gse: products.filter(p => p.category === 'gse').length,
  }), [products])

  if (!loaded) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Chargement du catalogue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
            <Package className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">LLEDO Aerotools</h1>
            <p className="text-xs text-gray-500">Gestion du catalogue — {products.length} produits</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/boutique" target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm font-bold text-gray-300 hover:text-white transition-colors">
            <ExternalLink className="h-4 w-4" /> Voir la boutique
          </Link>
          <button onClick={() => setEditing({ ...emptyProduct })}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors">
            <Plus className="h-4 w-4" /> Nouveau produit
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Barres de Remorquage', count: stats.barres, icon: Truck, color: 'blue' },
          { label: 'Rollers Hydrauliques', count: stats.rollers, icon: RotateCw, color: 'cyan' },
          { label: 'Maintenance', count: stats.maintenance, icon: Wrench, color: 'amber' },
          { label: 'Équipement Sol', count: stats.gse, icon: Settings2, color: 'purple' },
        ].map(s => {
          const Icon = s.icon
          return (
            <button key={s.label} onClick={() => setCatFilter(catFilter === PRODUCT_TYPES.find(t => t.label === s.label)?.id ? 'all' : PRODUCT_TYPES.find(t => t.label === s.label)?.id || 'all')}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-left hover:bg-gray-800/80 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <p className="text-xs font-bold text-gray-500 uppercase">{s.label}</p>
              </div>
              <p className="text-3xl font-black text-white">{s.count}</p>
            </button>
          )
        })}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-2">
          {[{ id: 'all', label: 'Tous', icon: Package }, ...PRODUCT_TYPES].map(c => {
            const Icon = c.icon
            return (
              <button key={c.id} onClick={() => setCatFilter(c.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  catFilter === c.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700 hover:text-white'
                }`}>
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions secondaires */}
      <div className="flex gap-2 mb-4">
        <button onClick={exportJSON}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs font-bold text-gray-500 hover:text-white transition-colors">
          <Download className="h-3.5 w-3.5" /> Exporter JSON
        </button>
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs font-bold text-gray-500 hover:text-white transition-colors">
          <Upload className="h-3.5 w-3.5" /> Importer JSON
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        <button onClick={() => { if (confirm('Réinitialiser le catalogue aux données par défaut ?')) { resetToDefaults(); showToast('Catalogue réinitialisé') } }}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs font-bold text-gray-500 hover:text-white transition-colors">
          <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser
        </button>
      </div>

      {/* Tableau des produits */}
      <div className="bg-gray-800/20 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/40">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500">Produit</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-500 hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-500 hidden sm:table-cell">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase text-gray-500 hidden lg:table-cell">Photos</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const typeInfo = PRODUCT_TYPES.find(t => t.id === p.category)
              const TypeIcon = typeInfo?.icon || Package
              return (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => setEditing(p)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {p.image ? (
                          <Image src={p.image} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <Package className="h-6 w-6 text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{p.name}</p>
                        <p className="text-xs text-gray-600">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs font-bold text-gray-400">
                      <TypeIcon className="h-3.5 w-3.5" />
                      {typeInfo?.label || p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className={`inline-block w-3 h-3 rounded-full ${p.inStock ? 'bg-green-500' : 'bg-amber-500'}`} title={p.inStock ? 'En stock' : 'Sur commande'} />
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="text-xs text-gray-500">{p.gallery.length + (p.image ? 1 : 0)}</span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => reorderProduct(p.id, 'up')} className="p-2 text-gray-600 hover:text-white rounded-lg hover:bg-gray-800 transition-colors" title="Monter">
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button onClick={() => reorderProduct(p.id, 'down')} className="p-2 text-gray-600 hover:text-white rounded-lg hover:bg-gray-800 transition-colors" title="Descendre">
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditing(p)} className="p-2 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-gray-800 transition-colors" title="Modifier">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => duplicateProduct(p.id)} className="p-2 text-gray-500 hover:text-cyan-400 rounded-lg hover:bg-gray-800 transition-colors" title="Dupliquer">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button onClick={() => setConfirmDelete(p.id)} className="p-2 text-gray-600 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors" title="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-16 text-center text-gray-600 text-sm">Aucun produit trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit panel */}
      <AnimatePresence>
        {editing && <ProductForm key={editing.id} product={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmDelete(null)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Supprimer ce produit ?</h3>
                  <p className="text-xs text-gray-500">{products.find(p => p.id === confirmDelete)?.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">Cette action est irréversible. Le produit sera retiré du catalogue.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                  Annuler
                </button>
                <button onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); showToast('Produit supprimé') }}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-500 transition-colors">
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-green-900/90 border border-green-700 rounded-xl shadow-2xl">
            <Check className="h-5 w-5 text-green-400" />
            <span className="text-sm font-bold text-white">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
