'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const variants = {
    danger: {
      icon: 'bg-red-100 dark:bg-red-900/30 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  }

  const style = variants[variant]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${style.icon}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 ${style.button}`}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
