'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone,
  FileText,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Filter
} from 'lucide-react'

interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  message?: string
  cvUrl: string
  cvName?: string
  status: string
  notes?: string
  createdAt: string
  job: { title: string; slug: string }
}

const statusOptions = [
  { value: 'NEW', label: 'Nouvelle', color: 'bg-blue-100 text-blue-700' },
  { value: 'IN_REVIEW', label: 'En cours', color: 'bg-amber-100 text-amber-700' },
  { value: 'INTERVIEW', label: 'Entretien', color: 'bg-purple-100 text-purple-700' },
  { value: 'ACCEPTED', label: 'Acceptée', color: 'bg-green-100 text-green-700' },
  { value: 'REJECTED', label: 'Refusée', color: 'bg-red-100 text-red-700' },
]

export default function AdminCandidaturesPage() {
  const searchParams = useSearchParams()
  const filterJobId = searchParams.get('jobId')
  
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, filterJobId])

  async function fetchApplications() {
    setLoading(true)
    try {
      let url = '/api/applications'
      const params = new URLSearchParams()
      if (statusFilter) params.append('status', statusFilter)
      if (filterJobId) params.append('jobId', filterJobId)
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setApplications(data.applications)
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(true)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (res.ok) {
        setApplications(apps => 
          apps.map(a => a.id === id ? { ...a, status } : a)
        )
        if (selectedApp?.id === id) {
          setSelectedApp({ ...selectedApp, status })
        }
      }
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-muted-strong">Candidatures</h1>
          <p className="text-muted mt-1">{applications.length} candidature(s)</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted">Aucune candidature</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const status = statusOptions.find(s => s.value === app.status) || statusOptions[0]
                
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer transition-shadow hover:shadow-md ${
                      selectedApp?.id === app.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-muted-strong">
                          {app.firstName} {app.lastName}
                        </h3>
                        <p className="text-sm text-muted">{app.job.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {app.email}
                          </span>
                          {app.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {app.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        <p className="text-xs text-muted mt-2">
                          {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedApp ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold text-muted-strong mb-4">
                {selectedApp.firstName} {selectedApp.lastName}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted">Poste</label>
                  <p className="font-medium">{selectedApp.job.title}</p>
                </div>
                <div>
                  <label className="text-sm text-muted">Email</label>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                {selectedApp.phone && (
                  <div>
                    <label className="text-sm text-muted">Téléphone</label>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                )}
                {selectedApp.message && (
                  <div>
                    <label className="text-sm text-muted">Message</label>
                    <p className="text-sm">{selectedApp.message}</p>
                  </div>
                )}
              </div>

              {/* CV Download */}
              <a
                href={selectedApp.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-6"
              >
                <FileText className="h-5 w-5 text-primary-600" />
                <span className="flex-1 truncate">{selectedApp.cvName || 'CV'}</span>
                <Download className="h-4 w-4" />
              </a>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium mb-2">Changer le statut</label>
                <select
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center text-muted">
              <User className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Sélectionnez une candidature pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
