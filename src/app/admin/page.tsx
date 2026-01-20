'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Users, 
  Briefcase, 
  FileText, 
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Loader2
} from 'lucide-react'

interface Stats {
  users: { total: number }
  jobs: { total: number; published: number }
  applications: { total: number; new: number }
  blog: { total: number; published: number }
  reviews: { total: number; pending: number }
}

interface RecentApplication {
  id: string
  firstName: string
  lastName: string
  email: string
  status: string
  createdAt: string
  job: { title: string }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
          setRecentApplications(data.recentApplications)
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Utilisateurs',
      value: stats?.users.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/utilisateurs'
    },
    {
      label: 'Offres publiées',
      value: `${stats?.jobs.published || 0}/${stats?.jobs.total || 0}`,
      icon: Briefcase,
      color: 'bg-green-500',
      href: '/admin/offres'
    },
    {
      label: 'Nouvelles candidatures',
      value: stats?.applications.new || 0,
      icon: TrendingUp,
      color: 'bg-amber-500',
      href: '/admin/candidatures'
    },
    {
      label: 'Articles publiés',
      value: `${stats?.blog.published || 0}/${stats?.blog.total || 0}`,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/admin/blog'
    },
    {
      label: 'Avis en attente',
      value: stats?.reviews.pending || 0,
      icon: Star,
      color: 'bg-pink-500',
      href: '/admin/avis'
    },
  ]

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-muted-strong">Dashboard</h1>
        <p className="text-muted mt-1">Vue d'ensemble de l'administration</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={stat.href}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold text-muted-strong">{stat.value}</p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-muted-strong">Candidatures récentes</h2>
          <Link href="/admin/candidatures" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Voir tout →
          </Link>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentApplications.length === 0 ? (
            <div className="p-8 text-center text-muted">
              Aucune candidature pour le moment
            </div>
          ) : (
            recentApplications.map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div>
                  <p className="font-medium text-muted-strong">
                    {app.firstName} {app.lastName}
                  </p>
                  <p className="text-sm text-muted">{app.job.title}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    app.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'IN_REVIEW' ? 'bg-amber-100 text-amber-700' :
                    app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {app.status === 'NEW' ? 'Nouvelle' :
                     app.status === 'IN_REVIEW' ? 'En cours' :
                     app.status === 'ACCEPTED' ? 'Acceptée' : app.status}
                  </span>
                  <span className="text-sm text-muted">
                    {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
