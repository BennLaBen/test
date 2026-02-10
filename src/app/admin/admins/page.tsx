'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Shield, ShieldCheck, Eye, Loader2, Mail,
  CheckCircle, XCircle, AlertTriangle, X, Building2,
  Clock, Trash2, MoreVertical, Pencil
} from 'lucide-react'

interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  role: string
  isActive: boolean
  emailVerified: boolean
  lastLogin: string | null
  createdAt: string
}

const COMPANIES = [
  { value: 'MPEB', label: 'MPEB' },
  { value: 'EGI', label: 'EGI' },
  { value: 'FREM', label: 'FREM' },
  { value: 'MGP', label: 'MGP' },
  { value: 'Aerotools', label: 'Aerotools' },
  { value: 'Groupe', label: 'Groupe' },
]

const ROLES = [
  { value: 'ADMIN', label: 'Administrateur', icon: Shield, desc: 'Accès complet au panel admin' },
  { value: 'VIEWER', label: 'Lecteur', icon: Eye, desc: 'Lecture seule, pas de modifications' },
]

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Admin | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [changeRoleAdmin, setChangeRoleAdmin] = useState<Admin | null>(null)
  const [newRole, setNewRole] = useState('')
  const [changingRole, setChangingRole] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: 'MPEB',
    role: 'ADMIN',
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  async function fetchAdmins() {
    try {
      const res = await fetch('/api/admin-auth/admins')
      const data = await res.json()
      if (data.success) {
        setAdmins(data.admins)
      }
    } catch (err) {
      console.error('Error fetching admins:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)

    try {
      const res = await fetch('/api/admin-auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Erreur lors de l\'invitation' })
        return
      }

      setToast({ type: 'success', message: `Invitation envoyée à ${formData.email}` })
      setShowInviteModal(false)
      setFormData({ email: '', firstName: '', lastName: '', company: 'MPEB', role: 'ADMIN' })
      fetchAdmins()
    } catch {
      setToast({ type: 'error', message: 'Erreur de connexion' })
    } finally {
      setInviting(false)
    }
  }

  function getRoleBadge(role: string) {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"><ShieldCheck className="w-3 h-3" /> Super Admin</span>
      case 'ADMIN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><Shield className="w-3 h-3" /> Admin</span>
      case 'VIEWER':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"><Eye className="w-3 h-3" /> Lecteur</span>
      default:
        return null
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleDelete(admin: Admin) {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin-auth/admins/${admin.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Erreur lors de la suppression' })
        return
      }
      setToast({ type: 'success', message: data.message || 'Administrateur supprimé' })
      setConfirmDelete(null)
      fetchAdmins()
    } catch {
      setToast({ type: 'error', message: 'Erreur de connexion' })
    } finally {
      setDeleting(false)
    }
  }

  async function handleChangeRole() {
    if (!changeRoleAdmin || !newRole) return
    setChangingRole(true)
    try {
      const res = await fetch(`/api/admin-auth/admins/${changeRoleAdmin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Erreur lors de la modification' })
        return
      }
      setToast({ type: 'success', message: data.message || 'Rôle modifié' })
      setChangeRoleAdmin(null)
      fetchAdmins()
    } catch {
      setToast({ type: 'error', message: 'Erreur de connexion' })
    } finally {
      setChangingRole(false)
    }
  }

  function getStatusBadge(admin: Admin) {
    if (!admin.isActive && !admin.emailVerified) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="w-3 h-3" /> En attente</span>
    }
    if (admin.isActive) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3" /> Actif</span>
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3" /> Inactif</span>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des administrateurs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{admins.length} administrateur{admins.length > 1 ? 's' : ''} enregistré{admins.length > 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
        >
          <UserPlus className="w-5 h-5" />
          Inviter un admin
        </button>
      </motion.div>

      {/* Admins Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Administrateur</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Société</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rôle</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dernière connexion</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                        {admin.firstName[0]}{admin.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{admin.firstName} {admin.lastName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {admin.company}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(admin.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(admin)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : <span className="text-gray-400 italic">Jamais</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    {admin.role !== 'SUPER_ADMIN' && (
                      <div className="relative inline-block" ref={openMenuId === admin.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === admin.id ? null : admin.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        <AnimatePresence>
                          {openMenuId === admin.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden"
                            >
                              <button
                                onClick={() => {
                                  setOpenMenuId(null)
                                  setChangeRoleAdmin(admin)
                                  setNewRole(admin.role === 'ADMIN' ? 'VIEWER' : 'ADMIN')
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              >
                                <Pencil className="w-4 h-4 text-blue-500" />
                                Modifier le rôle
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null)
                                  setConfirmDelete(admin)
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer définitivement
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Aucun administrateur pour le moment</p>
          </div>
        )}
      </motion.div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Inviter un administrateur</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Un email d'activation sera envoyé</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleInvite} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prénom</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="DUPONT"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="admin@lledo-industries.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Société</label>
                    <select
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {COMPANIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rôle</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Role description */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {ROLES.find(r => r.value === formData.role)?.desc}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {inviting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Envoyer l'invitation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => !deleting && setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Supprimer définitivement</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  Êtes-vous sûr de vouloir supprimer
                </p>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {confirmDelete.firstName} {confirmDelete.lastName}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                  ({confirmDelete.email})
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mb-6">
                  Cette action est irréversible.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => handleDelete(confirmDelete)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    {deleting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Suppression...</>
                    ) : (
                      <><Trash2 className="w-4 h-4" /> Supprimer</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Role Modal */}
      <AnimatePresence>
        {changeRoleAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => !changingRole && setChangeRoleAdmin(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Modifier le rôle</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{changeRoleAdmin.firstName} {changeRoleAdmin.lastName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setChangeRoleAdmin(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  {ROLES.map(r => {
                    const Icon = r.icon
                    const isSelected = newRole === r.value
                    return (
                      <button
                        key={r.value}
                        onClick={() => setNewRole(r.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className={`font-semibold ${
                            isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                          }`}>{r.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{r.desc}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                        )}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={changingRole}
                    onClick={() => setChangeRoleAdmin(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={changingRole || newRole === changeRoleAdmin.role}
                    onClick={handleChangeRole}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changingRole ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Modification...</>
                    ) : (
                      'Confirmer'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
