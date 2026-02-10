'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Star,
  Settings,
  LogOut,
  Building2,
  Image as ImageIcon,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { ToastProvider } from '@/components/admin/Toast'
import { useTranslation } from 'react-i18next'

const adminNav = [
  { href: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard },
  { href: '/admin/entreprises', labelKey: 'admin.companies', icon: Building2 },
  { href: '/admin/offres', labelKey: 'admin.jobOffers', icon: Briefcase },
  { href: '/admin/candidatures', labelKey: 'admin.applications', icon: Users },
  { href: '/admin/blog', labelKey: 'admin.blog', icon: FileText },
  { href: '/admin/medias', labelKey: 'admin.mediaLibrary', icon: ImageIcon },
  { href: '/admin/avis', labelKey: 'admin.reviews', icon: Star },
  { href: '/admin/admins', labelKey: 'admin.admins', icon: ShieldCheck },
]

function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { t } = useTranslation('common')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 pt-16 lg:pt-20 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 h-full flex flex-col">
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-700">
            <Building2 className="h-8 w-8 text-primary-400" />
            <div>
              <p className="font-bold">LLEDO Admin</p>
              <p className="text-xs text-gray-400">{t('admin.panel')}</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {adminNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {t(item.labelKey)}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={async () => {
                await fetch('/api/admin-auth/logout', { method: 'POST' })
                window.location.href = '/admin/login'
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              {t('auth.logout')}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SessionProvider>
      <ToastProvider>
        <div className="flex min-h-screen">
          {/* Mobile header */}
          <div className="fixed top-0 left-0 right-0 h-14 bg-gray-900 flex items-center px-4 z-30 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-white hover:bg-gray-800 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-3 font-bold text-white">LLEDO Admin</span>
          </div>
          
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1 lg:ml-64 min-h-screen bg-gray-100 dark:bg-gray-900 pt-14 lg:pt-0">
            {children}
          </main>
        </div>
      </ToastProvider>
    </SessionProvider>
  )
}
