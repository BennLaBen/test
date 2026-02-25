'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon,
  FileText,
  Loader2,
  X,
  Check,
  Copy,
  FolderOpen,
  Search,
  Grid,
  List
} from 'lucide-react'

interface MediaItem {
  id: string
  filename: string
  path: string
  url: string
  mimeType: string
  size: number
  width?: number
  height?: number
  alt?: string
  folder: string
  createdAt: string
}

const FOLDERS = ['general', 'blog', 'societes', 'equipe', 'produits']

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [selectedFolder])

  async function fetchMedia() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedFolder) params.set('folder', selectedFolder)
      
      const res = await fetch(`/api/admin/media?${params}`)
      const data = await res.json()
      if (data.success) {
        setMedia(data.media)
      }
    } catch (err) {
      console.error('Error fetching media:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', selectedFolder || 'general')

        const res = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()
        if (data.success) {
          setMedia(prev => [data.media, ...prev])
        }
      } catch (err) {
        console.error('Error uploading:', err)
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Supprimer "${item.filename}" ?`)) return

    setDeleting(item.id)
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== item.id))
      }
    } catch (err) {
      console.error('Error deleting:', err)
    } finally {
      setDeleting(null)
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-muted-strong">Médiathèque</h1>
          <p className="text-muted mt-1">
            {media.length} fichier(s) — Uploadez vos images et documents ici, puis copiez l'URL pour les utiliser dans le blog, les offres d'emploi ou les pages entreprises.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary flex items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
            {uploading ? 'Upload...' : 'Uploader'}
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un fichier..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>

        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <option value="">Tous les dossiers</option>
          {FOLDERS.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>

        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted mb-4">Aucun média</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            Uploader un fichier
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="aspect-square bg-gray-900 flex items-center justify-center">
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-gray-500" />
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                  title="Copier l'URL"
                >
                  {copied === item.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                  title="Supprimer"
                >
                  {deleting === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-white truncate">{item.filename}</p>
                <p className="text-xs text-gray-500">{formatSize(item.size)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="w-16 h-16 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="h-8 w-8 text-gray-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{item.filename}</p>
                <p className="text-sm text-gray-400">
                  {formatSize(item.size)}
                  {item.width && item.height && ` • ${item.width}×${item.height}`}
                  {' • '}{item.folder}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Copier l'URL"
                >
                  {copied === item.url ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deleting === item.id}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  {deleting === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
