'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-500',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-500',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-500',
    title: 'text-amber-800 dark:text-amber-200',
    message: 'text-amber-700 dark:text-amber-300',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-500',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, type, title, message }])
    
    // Auto remove after 4 seconds
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast])
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast])
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast])
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => {
            const Icon = icons[toast.type]
            const color = colors[toast.type]
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${color.bg} ${color.border}`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${color.icon}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${color.title}`}>{toast.title}</p>
                  {toast.message && (
                    <p className={`text-sm mt-0.5 ${color.message}`}>{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors ${color.icon}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
