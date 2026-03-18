'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Copy, ChevronUp, ChevronDown, Download, Upload, RotateCcw,
  Search, Edit3, Eye, X, Save, AlertTriangle, Lock, Package, Check
} from 'lucide-react'
import { useProductAdmin, emptyProduct, validateProduct } from '@/lib/shop/useProductAdmin'
import type { ShopProduct } from '@/lib/shop/types'
import { ProductCard } from '@/components/shop/ProductCard'
import Image from 'next/image'

// Fallback categories if DB fetch fails
const FALLBACK_CATEGORIES = [
  { id: 'barres-remorquage', slug: 'barres-remorquage', label: 'Barres de remorquage' },
  { id: 'rollers-manutention', slug: 'rollers-manutention', label: 'Rollers & Manutention' },
  { id: 'outillage-maintenance', slug: 'outillage-maintenance', label: 'Outillage de maintenance' },
  { id: 'ground-support', slug: 'ground-support', label: 'Ground Support Equipment' },
]

const MATERIALS = [
  { id: 'steel', label: 'Acier' },
  { id: 'aluminum', label: 'Aluminium' },
  { id: 'steel-alu', label: 'Acier / Alu' },
  { id: 'composite', label: 'Composite' },
]

const USAGE_OPTIONS = ['civil', 'military', 'offshore', 'sar', 'naval']
const PRICE_RANGES = [
  { id: 'low', label: '€' },
  { id: 'medium', label: '€€' },
  { id: 'high', label: '€€€' },
]


/* ═══════════════════════════════════════
   KEY-VALUE EDITOR (specs, tolerances, materials)
   ═══════════════════════════════════════ */
function KVEditor({ data, onChange, label }: { data: Record<string, string>; onChange: (d: Record<string, string>) => void; label: string }) {
  const [newKey, setNewKey] = useState('')
  const [newVal, setNewVal] = useState('')

  const addEntry = () => {
    if (!newKey.trim()) return
    onChange({ ...data, [newKey.trim()]: newVal.trim() })
    setNewKey('')
    setNewVal('')
  }

  const removeEntry = (key: string) => {
    const next = { ...data }
    delete next[key]
    onChange(next)
  }

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <div className="space-y-1.5 mb-2">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2 bg-gray-800/30 rounded-lg px-3 py-1.5 text-xs">
            <span className="text-gray-400 font-medium flex-shrink-0">{key}</span>
            <span className="text-gray-600 mx-1">→</span>
            <span className="text-white font-mono flex-1 truncate">{val}</span>
            <button onClick={() => removeEntry(key)} className="text-gray-600 hover:text-red-400 flex-shrink-0">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text" value={newKey} onChange={e => setNewKey(e.target.value)}
          placeholder="Clé" className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500"
        />
        <input
          type="text" value={newVal} onChange={e => setNewVal(e.target.value)}
          placeholder="Valeur"
          onKeyDown={e => e.key === 'Enter' && addEntry()}
          className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500"
        />
        <button onClick={addEntry} className="px-2 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-xs font-bold hover:bg-blue-600/30">
          +
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   TAG EDITOR (features, compatibility, usage, etc.)
   ═══════════════════════════════════════ */
function TagEditor({ tags, onChange, label, placeholder }: { tags: string[]; onChange: (t: string[]) => void; label: string; placeholder?: string }) {
  const [input, setInput] = useState('')

  const add = () => {
    const val = input.trim()
    if (!val || tags.includes(val)) return
    onChange([...tags, val])
    setInput('')
  }

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-900/20 border border-blue-500/20 rounded text-[10px] font-bold text-blue-300 uppercase">
            {tag}
            <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="text-blue-500/50 hover:text-red-400">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder={placeholder || 'Ajouter...'}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500"
        />
        <button onClick={add} className="px-2 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded text-blue-400 text-xs font-bold hover:bg-blue-600/30">
          +
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   PRODUCT FORM
   ═══════════════════════════════════════ */
function ProductForm({ product, onSave, onCancel, categories }: {
  product: ShopProduct
  onSave: (p: ShopProduct) => void
  onCancel: () => void
  categories: { id: string; slug: string; label: string }[]
}) {
  const [draft, setDraft] = useState<ShopProduct>({ ...product })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

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
      return
    }
    onSave(draft)
  }

  const field = (key: keyof ShopProduct, label: string, type: 'text' | 'textarea' = 'text', opts?: { placeholder?: string }) => (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={(draft[key] as string) || ''}
          onChange={e => set(key, e.target.value as any)}
          placeholder={opts?.placeholder}
          rows={3}
          className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-sm text-white placeholder-gray-600 outline-none resize-none transition-colors ${errors[key as string] ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
        />
      ) : (
        <input
          type="text"
          value={(draft[key] as string) || ''}
          onChange={e => set(key, e.target.value as any)}
          onBlur={key === 'name' ? autoSlug : undefined}
          placeholder={opts?.placeholder}
          className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-sm text-white placeholder-gray-600 outline-none transition-colors ${errors[key as string] ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'}`}
        />
      )}
      {errors[key as string] && <p className="text-[10px] text-red-400 mt-1">{errors[key as string]}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-gray-900 border-l border-gray-800 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black uppercase text-white">
              {product.id ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <p className="text-[10px] text-gray-500 font-mono uppercase">{draft.id || 'ID auto-généré'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button onClick={onCancel} className="p-2 text-gray-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Live preview */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Aperçu carte produit</p>
                <div className="max-w-sm mx-auto pointer-events-none">
                  <ProductCard product={draft as any} index={0} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── IDENTITÉ ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-gray-800 pb-2">Identité produit</h3>
            {field('name', 'Nom du produit *', 'text', { placeholder: 'Barre de Remorquage H160' })}
            <div className="grid grid-cols-2 gap-4">
              {field('slug', 'Slug URL *', 'text', { placeholder: 'barre-remorquage-h160' })}
              {field('id', 'Référence (auto si vide)', 'text', { placeholder: 'BR-H160' })}
            </div>
            {field('shortDescription', 'Accroche courte', 'text', { placeholder: 'Tractage certifié H160 — Verrouillage rapide' })}
            {field('description', 'Description complète *', 'textarea', { placeholder: 'Solution de tractage certifiée...' })}
          </div>

          {/* ── CLASSIFICATION ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-gray-800 pb-2">Classification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Catégorie *</label>
                <select value={draft.category} onChange={e => set('category', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-blue-500">
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Matériau</label>
                <select value={draft.material} onChange={e => set('material', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-blue-500">
                  {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Budget</label>
                <select value={draft.priceRange} onChange={e => set('priceRange', e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-blue-500">
                  {PRICE_RANGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              </div>
              {field('priceDisplay', 'Affichage prix', 'text', { placeholder: 'SUR DEVIS' })}
              {field('leadTime', 'Délai', 'text', { placeholder: '4-8 semaines' })}
            </div>
          </div>

          {/* ── FLAGS ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-gray-800 pb-2">Statut</h3>
            <div className="flex flex-wrap gap-4">
              {([
                ['inStock', 'En stock'],
                ['isNew', 'Nouveau'],
                ['isFeatured', 'Mis en avant'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    draft[key] ? 'bg-blue-600 border-blue-500' : 'border-gray-600'
                  }`}>
                    {draft[key] && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-xs text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── TAGS ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-gray-800 pb-2">Tags &amp; Compatibilité</h3>
            <TagEditor tags={draft.compatibility} onChange={v => set('compatibility', v)} label="Hélicoptères compatibles" placeholder="H160, NH90..." />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Usage</p>
              <div className="flex flex-wrap gap-2">
                {USAGE_OPTIONS.map(u => (
                  <button key={u} onClick={() => set('usage', draft.usage.includes(u) ? draft.usage.filter(x => x !== u) : [...draft.usage, u])}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      draft.usage.includes(u) ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700'
                    }`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <TagEditor tags={draft.features} onChange={v => set('features', v)} label="Caractéristiques" placeholder="Verrouillage rapide..." />
            <TagEditor tags={draft.certifications || []} onChange={v => set('certifications', v)} label="Certifications" placeholder="CE, EN 12312..." />
            <TagEditor tags={draft.applications || []} onChange={v => set('applications', v)} label="Applications" placeholder="Tractage sur piste..." />
          </div>

          {/* ── SPECS ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-gray-800 pb-2">Données techniques</h3>
            <KVEditor data={draft.specs} onChange={v => set('specs', v)} label="Spécifications" />
            <KVEditor data={draft.tolerances || {}} onChange={v => set('tolerances', v)} label="Tolérances" />
            <KVEditor data={draft.materials || {}} onChange={v => set('materials', v)} label="Matériaux &amp; traitements" />
          </div>

          {/* ── MEDIA ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400 border-b border-gray-800 pb-2">Média</h3>
            
            {/* Main image with upload */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Image principale</p>
              <div className="flex items-start gap-3">
                <div className="w-24 h-24 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {draft.image ? (
                    <Image src={draft.image} alt="Preview" width={96} height={96} className="object-contain w-full h-full" />
                  ) : (
                    <Package className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={draft.image || ''}
                    onChange={e => set('image', e.target.value)}
                    placeholder="/images/products/towbar-h160.jpg"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-blue-500"
                  />
                  <label className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-400 cursor-pointer hover:bg-blue-600/30 transition-colors w-fit">
                    <Upload className="h-3.5 w-3.5" />
                    Uploader une image
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const fd = new FormData()
                      fd.append('file', file)
                      try {
                        const res = await fetch('/api/v2/upload', { method: 'POST', body: fd })
                        const data = await res.json()
                        if (data.success) set('image', data.url)
                        else alert(data.error)
                      } catch { alert('Erreur upload') }
                      e.target.value = ''
                    }} />
                  </label>
                  {draft.image && (
                    <button onClick={() => set('image', '')} className="text-[10px] text-red-400 hover:text-red-300">Supprimer l&apos;image</button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery editor with upload */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Galerie d&apos;images</p>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {draft.gallery.map((url, i) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                      {url ? (
                        <Image src={url} alt={`Gallery ${i}`} width={120} height={120} className="object-contain w-full h-full" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-600 text-[10px]">Vide</div>
                      )}
                    </div>
                    <button
                      onClick={() => set('gallery', draft.gallery.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <label className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg text-xs font-bold text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-colors cursor-pointer text-center">
                  <Upload className="h-3.5 w-3.5 inline mr-1" />
                  Uploader
                  <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                    const files = e.target.files
                    if (!files) return
                    const urls: string[] = []
                    for (const file of Array.from(files)) {
                      const fd = new FormData()
                      fd.append('file', file)
                      try {
                        const res = await fetch('/api/v2/upload', { method: 'POST', body: fd })
                        const data = await res.json()
                        if (data.success) urls.push(data.url)
                      } catch { /* skip */ }
                    }
                    if (urls.length) set('gallery', [...draft.gallery, ...urls])
                    e.target.value = ''
                  }} />
                </label>
                <button
                  onClick={() => set('gallery', [...draft.gallery, ''])}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg text-xs font-bold text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                >
                  + URL
                </button>
              </div>
            </div>

            {field('datasheetUrl', 'Fiche technique PDF (URL)' as any, 'text', { placeholder: '/docs/towbar-h160.pdf' })}
            {field('model3d', 'Modèle 3D (URL)' as any, 'text', { placeholder: '/models/towbar.glb' })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-between">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            Annuler
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-500 transition-colors">
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════ */
export default function AdminCataloguePage() {
  return <AdminDashboard />
}

function AdminDashboard() {
  const { products, categories, loaded, isAdmin, addProduct, updateProduct, deleteProduct, duplicateProduct, reorderProduct, exportJSON, importJSON, resetToDefaults } = useProductAdmin()
  const ADMIN_CATS = categories.length > 0 ? categories : FALLBACK_CATEGORIES
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
      if (catFilter !== 'all' && p.category !== catFilter && p._categoryId !== catFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
      }
      return true
    })
  }, [products, search, catFilter])

  const handleSave = async (p: ShopProduct) => {
    if (editing?.id && products.some(x => x.id === editing.id)) {
      const result = await updateProduct(editing.id, p)
      if (result.success) {
        showToast(`"${p.name}" mis à jour`)
      } else {
        showToast(`Erreur : ${result.error}`)
      }
    } else {
      const result = await addProduct(p)
      if (result.success) {
        showToast(`"${p.name}" ajouté au catalogue`)
      } else {
        showToast(`Erreur : ${result.error}`)
      }
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

  if (!loaded) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">Chargement...</div>
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center">
              <Lock className="h-7 w-7 text-red-400" />
            </div>
          </div>
          <h1 className="text-xl font-black uppercase text-white mb-2">Accès refusé</h1>
          <p className="text-sm text-gray-400 mb-6">Vous devez être connecté en tant qu&apos;administrateur LLEDO pour accéder à cette page.</p>
          <a href="/admin/login" className="inline-block w-full py-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-blue-500 transition-colors">
            Se connecter
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-28 pb-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Admin Catalogue</h1>
            <p className="text-xs text-gray-500">{products.length} produit{products.length > 1 ? 's' : ''} — AEROTOOL by LLEDO</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setEditing({ ...emptyProduct })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors">
              <Plus className="h-4 w-4" /> Nouveau
            </button>
            <button onClick={exportJSON}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors">
              <Upload className="h-3.5 w-3.5" /> Import
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button onClick={() => { if (confirm('Réinitialiser le catalogue aux données par défaut ?')) { resetToDefaults(); showToast('Catalogue réinitialisé') } }}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors">
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom, réf, slug..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-1.5">
            {[{ id: 'all', slug: 'all', label: 'Tous' }, ...ADMIN_CATS].map(c => (
              <button key={c.id} onClick={() => setCatFilter(c.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  catFilter === c.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700 hover:text-white'
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products table */}
        <div className="bg-gray-800/20 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/40">
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500">Produit</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden sm:table-cell">Stock</th>
                <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">Specs</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] font-mono text-gray-600">{p.id} — /{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] font-bold uppercase text-gray-400">
                      {ADMIN_CATS.find(c => c.slug === p.category)?.label || p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      p.inStock ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'
                    }`}>
                      {p.inStock ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className="text-xs text-gray-500">{Object.keys(p.specs).length}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => reorderProduct(p.id, 'up')} className="p-1.5 text-gray-600 hover:text-white rounded transition-colors" title="Monter">
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => reorderProduct(p.id, 'down')} className="p-1.5 text-gray-600 hover:text-white rounded transition-colors" title="Descendre">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setEditing(p)} className="p-1.5 text-gray-500 hover:text-blue-400 rounded transition-colors" title="Modifier">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => duplicateProduct(p.id)} className="p-1.5 text-gray-500 hover:text-cyan-400 rounded transition-colors" title="Dupliquer">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(p.id)} className="p-1.5 text-gray-600 hover:text-red-400 rounded transition-colors" title="Supprimer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-600 text-sm">Aucun produit trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit panel */}
      <AnimatePresence>
        {editing && (
          <ProductForm product={editing} onSave={handleSave} onCancel={() => setEditing(null)} categories={ADMIN_CATS} />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setConfirmDelete(null)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Supprimer ce produit ?</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{confirmDelete}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6">Cette action est irréversible. Le produit sera retiré du catalogue local.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase hover:bg-gray-800 transition-colors">
                  Annuler
                </button>
                <button onClick={async () => {
                    const id = confirmDelete
                    setConfirmDelete(null)
                    const result = await deleteProduct(id!)
                    if (result.success) {
                      showToast('Produit supprimé avec succès')
                    } else {
                      showToast(`Erreur : ${result.error}`)
                    }
                  }}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-red-500 transition-colors">
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
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl"
          >
            <Check className="h-4 w-4 text-green-400" />
            <span className="text-sm text-white">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
