'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export function FloatingCTA() {
  const { t } = useTranslation('common')
  const pathname = usePathname()
  
  // Ne rien afficher sur la boutique
  if (pathname?.startsWith('/boutique')) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50 lg:hidden"
    >
      <Link
        href="/contact"
        className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-full shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 active:scale-95 transition-all"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-sm">{t('nav.quote')}</span>
      </Link>
    </motion.div>
  )
}

