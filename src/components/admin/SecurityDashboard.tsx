'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, Smartphone, Monitor, Globe, Clock, LogOut, 
  Key, Download, RefreshCw, AlertTriangle, Check, X, 
  ChevronRight, Bell, Lock, Eye, EyeOff, Loader2 
} from 'lucide-react'

interface Session {
  id: string
  ipAddress: string
  location: string | null
  device: string | null
  browser: string | null
  lastActivity: string
  createdAt: string
  isCurrent: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod: 'TOTP' | 'EMAIL' | 'SMS' | null
  backupCodesCount: number
  notifyNewDevice: boolean
  notifyNewLocation: boolean
  notifyFailedLogin: boolean
  notifyPasswordChange: boolean
  notify2FAChange: boolean
}

export function SecurityDashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [settings, setSettings] = useState<SecuritySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'2fa' | 'sessions' | 'password' | 'notifications'>('2fa')
  const [isKillingSession, setIsKillingSession] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [sessionsRes, settingsRes] = await Promise.all([
        fetch('/api/admin-auth/sessions'),
        fetch('/api/admin-auth/security/settings'),
      ])
      
      if (sessionsRes.ok) {
        const data = await sessionsRes.json()
        setSessions(data.sessions)
      }
      
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error loading security data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const killSession = async (sessionId: string) => {
    setIsKillingSession(sessionId)
    try {
      const res = await fetch(`/api/admin-auth/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId))
      }
    } catch (error) {
      console.error('Error killing session:', error)
    } finally {
      setIsKillingSession(null)
    }
  }

  const killAllOtherSessions = async () => {
    if (!confirm('Déconnecter tous les autres appareils ?')) return
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin-auth/sessions?all=true', {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setSessions(sessions.filter(s => s.isCurrent))
      }
    } catch (error) {
      console.error('Error killing sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDeviceIcon = (device: string | null) => {
    if (!device) return <Monitor className="w-5 h-5" />
    if (device.toLowerCase().includes('mobile')) return <Smartphone className="w-5 h-5" />
    return <Monitor className="w-5 h-5" />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const tabs = [
    { id: '2fa', label: 'Authentification 2FA', icon: Shield },
    { id: 'sessions', label: 'Sessions actives', icon: Monitor },
    { id: 'password', label: 'Mot de passe', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ] as const

  if (isLoading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sécurité du compte
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos paramètres de sécurité et sessions actives
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === '2fa' && <TwoFactorSection settings={settings} onUpdate={loadData} />}
        {activeTab === 'sessions' && (
          <SessionsSection
            sessions={sessions}
            isKillingSession={isKillingSession}
            onKillSession={killSession}
            onKillAllOther={killAllOtherSessions}
            getDeviceIcon={getDeviceIcon}
            formatDate={formatDate}
          />
        )}
        {activeTab === 'password' && <PasswordSection />}
        {activeTab === 'notifications' && <NotificationsSection settings={settings} onUpdate={loadData} />}
      </motion.div>
    </div>
  )
}

// 2FA Section Component
function TwoFactorSection({ settings, onUpdate }: { settings: SecuritySettings | null; onUpdate: () => void }) {
  const [showSetup, setShowSetup] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startSetup = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin-auth/2fa/setup', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        setQrCode(data.qrCodeDataUrl)
        setSecret(data.secret)
        setShowSetup(true)
      } else {
        setError(data.error)
      }
    } catch {
      setError('Erreur lors de la configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setError('Entrez le code à 6 chiffres')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin-auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      })
      const data = await res.json()
      
      if (res.ok) {
        setBackupCodes(data.backupCodes)
        onUpdate()
      } else {
        setError(data.error)
      }
    } catch {
      setError('Erreur lors de l\'activation')
    } finally {
      setIsLoading(false)
    }
  }

  const disable2FA = async () => {
    if (!confirm('Désactiver l\'authentification à deux facteurs ?')) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/admin-auth/2fa/disable', { method: 'POST' })
      if (res.ok) {
        onUpdate()
        setShowSetup(false)
        setQrCode(null)
        setSecret(null)
        setBackupCodes(null)
      }
    } catch {
      setError('Erreur lors de la désactivation')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadBackupCodes = () => {
    if (!backupCodes) return
    const content = `LLEDO Industries - Codes de secours 2FA\n\nGardez ces codes en lieu sûr. Chaque code ne peut être utilisé qu'une fois.\n\n${backupCodes.join('\n')}\n\nGénérés le: ${new Date().toLocaleString('fr-FR')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lledo-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (backupCodes) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">2FA activé avec succès !</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Conservez ces codes de secours en lieu sûr
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, i) => (
              <code key={i} className="text-center py-2 bg-white dark:bg-gray-800 rounded font-mono text-sm">
                {code}
              </code>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadBackupCodes}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Télécharger
          </button>
          <button
            onClick={() => setBackupCodes(null)}
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Terminé
          </button>
        </div>
      </div>
    )
  }

  if (showSetup && qrCode) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Configurer l'authentification 2FA
        </h3>

        <div className="space-y-6">
          <div className="text-center">
            <img src={qrCode} alt="QR Code 2FA" className="mx-auto rounded-xl" />
            <p className="text-sm text-gray-500 mt-2">
              Scannez ce QR code avec Google Authenticator ou Authy
            </p>
          </div>

          {secret && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Clé secrète (si scan impossible)</p>
              <code className="text-sm font-mono break-all">{secret}</code>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code de vérification
            </label>
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={verifyAndEnable}
              disabled={isLoading || verifyCode.length !== 6}
              className="flex-1 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              Activer
            </button>
            <button
              onClick={() => {
                setShowSetup(false)
                setQrCode(null)
                setSecret(null)
              }}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${settings?.twoFactorEnabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
          <Shield className={`w-6 h-6 ${settings?.twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Authentification à deux facteurs
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {settings?.twoFactorEnabled
              ? `Activé via ${settings.twoFactorMethod === 'TOTP' ? 'application authenticator' : settings.twoFactorMethod}`
              : 'Ajoutez une couche de sécurité supplémentaire'}
          </p>
          
          {settings?.twoFactorEnabled && (
            <p className="text-sm text-gray-500 mt-2">
              {settings.backupCodesCount} code(s) de secours restant(s)
            </p>
          )}
        </div>
        
        {settings?.twoFactorEnabled ? (
          <button
            onClick={disable2FA}
            disabled={isLoading}
            className="px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Désactiver
          </button>
        ) : (
          <button
            onClick={startSetup}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Activer
          </button>
        )}
      </div>

      {!settings?.twoFactorEnabled && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Protection recommandée
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                L'authentification à deux facteurs protège votre compte même si votre mot de passe est compromis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sessions Section Component
function SessionsSection({
  sessions,
  isKillingSession,
  onKillSession,
  onKillAllOther,
  getDeviceIcon,
  formatDate,
}: {
  sessions: Session[]
  isKillingSession: string | null
  onKillSession: (id: string) => void
  onKillAllOther: () => void
  getDeviceIcon: (device: string | null) => JSX.Element
  formatDate: (date: string) => string
}) {
  const otherSessions = sessions.filter(s => !s.isCurrent)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {sessions.length} session(s) active(s)
        </h3>
        {otherSessions.length > 0 && (
          <button
            onClick={onKillAllOther}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Déconnecter tous les autres
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.map(session => (
          <div
            key={session.id}
            className={`bg-white dark:bg-gray-800 rounded-xl border p-4 ${
              session.isCurrent
                ? 'border-primary-500 dark:border-primary-400'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {getDeviceIcon(session.device)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {session.browser || 'Navigateur inconnu'}
                  </span>
                  {session.isCurrent && (
                    <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                      Session actuelle
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                  {session.location && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {session.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(session.lastActivity)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">IP: {session.ipAddress}</p>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => onKillSession(session.id)}
                  disabled={isKillingSession === session.id}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  {isKillingSession === session.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Password Section Component
function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    if (score <= 2) return { label: 'Faible', color: 'bg-red-500', width: '33%' }
    if (score <= 4) return { label: 'Moyen', color: 'bg-yellow-500', width: '66%' }
    return { label: 'Fort', color: 'bg-green-500', width: '100%' }
  }

  const strength = getPasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/admin-auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setError(data.error)
      }
    } catch {
      setError('Erreur lors du changement de mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Changer le mot de passe
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nouveau mot de passe
          </label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
            required
            minLength={12}
          />
          {newPassword && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Force: {strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={(e) => setShowPasswords(e.target.checked)}
            className="rounded"
          />
          Afficher les mots de passe
        </label>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
            <Check className="w-5 h-5" />
            Mot de passe modifié avec succès
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
          Changer le mot de passe
        </button>
      </form>
    </div>
  )
}

// Notifications Section Component
function NotificationsSection({ settings, onUpdate }: { settings: SecuritySettings | null; onUpdate: () => void }) {
  const [isLoading, setIsLoading] = useState(false)

  const toggleSetting = async (key: string, value: boolean) => {
    setIsLoading(true)
    try {
      await fetch('/api/admin-auth/security/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })
      onUpdate()
    } catch {
      console.error('Error updating setting')
    } finally {
      setIsLoading(false)
    }
  }

  const notifications = [
    { key: 'notifyNewDevice', label: 'Nouvelle connexion depuis un appareil inconnu', description: 'Recevez un email lors d\'une connexion depuis un nouvel appareil' },
    { key: 'notifyNewLocation', label: 'Connexion depuis un pays inhabituel', description: 'Alerte si connexion depuis une localisation inhabituelle' },
    { key: 'notifyFailedLogin', label: 'Tentatives de connexion échouées', description: 'Notification après 3 tentatives de connexion échouées' },
    { key: 'notifyPasswordChange', label: 'Changement de mot de passe', description: 'Confirmation par email lors d\'un changement de mot de passe' },
    { key: 'notify2FAChange', label: 'Modification de la 2FA', description: 'Alerte lors de l\'activation ou désactivation de la 2FA' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Notifications de sécurité
      </h3>

      <div className="space-y-4">
        {notifications.map(item => (
          <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
            </div>
            <button
              onClick={() => toggleSetting(item.key, !(settings as any)?.[item.key])}
              disabled={isLoading}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                (settings as any)?.[item.key] ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  (settings as any)?.[item.key] ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
