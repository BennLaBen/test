'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Upload, 
  Image as ImageIcon,
  Check,
  Loader2,
  Search
} from 'lucide-react'

interface MediaItem {
  id: string
  filename: string
  url: string
  mimeType: string
  width?: number
  height?: number
}

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string) => void
  folder?: string
}

export function MediaPicker({ isOpen, onClose, onSelect, folder = 'general' }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, folder])

  async function fetchMedia() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ type: 'images' })
      if (folder) params.set('folder', folder)
      
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
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setMedia(prev => [data.media, ...prev])
        setSelected(data.media.url)
      }
    } catch (err) {
      console.error('Error uploading:', err)
    } finally {
      setUploading(false)
    }
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected)
      onClose()
    }
  }

  const filteredMedia = media.filter(item =>
    item.filename.toLowerCase().includes(search.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Sélectionner une image</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-800">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{uploading ? 'Upload...' : 'Uploader'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Grid */}
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucune image trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {filteredMedia.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selected === item.url
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                    {selected === item.url && (
                      <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-700 bg-gray-800/50">
            <p className="text-sm text-gray-400">
              {selected ? 'Image sélectionnée' : 'Cliquez sur une image pour la sélectionner'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors"
              >
                Sélectionner
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
