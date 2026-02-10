import { SecurityDashboard } from '@/components/admin/SecurityDashboard'

export const metadata = {
  title: 'Sécurité - Admin LLEDO Industries',
  description: 'Gérez vos paramètres de sécurité et sessions actives',
  robots: 'noindex, nofollow',
}

export default function AdminSecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SecurityDashboard />
      </div>
    </div>
  )
}
