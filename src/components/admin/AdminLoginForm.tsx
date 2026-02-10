'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, Shield, AlertCircle, ArrowRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const twoFactorSchema = z.object({
  code: z.string().min(6, 'Code à 6 chiffres requis').max(10),
  isBackupCode: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>
type TwoFactorFormData = z.infer<typeof twoFactorSchema>

interface TwoFactorState {
  required: boolean
  method: 'TOTP' | 'EMAIL' | 'SMS'
  tempToken: string
  message: string
}

export function AdminLoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null)
  const [twoFactor, setTwoFactor] = useState<TwoFactorState | null>(null)
  const [useBackupCode, setUseBackupCode] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const twoFactorForm = useForm<TwoFactorFormData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: '', isBackupCode: false },
  })

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    setAttemptsRemaining(null)

    try {
      const response = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Erreur de connexion')
        if (result.attemptsRemaining !== undefined) {
          setAttemptsRemaining(result.attemptsRemaining)
        }
        return
      }

      if (result.requires2FA) {
        setTwoFactor({
          required: true,
          method: result.method,
          tempToken: result.tempToken,
          message: result.message,
        })
        return
      }

      // Login successful - redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const onTwoFactorSubmit = async (data: TwoFactorFormData) => {
    if (!twoFactor) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin-auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken: twoFactor.tempToken,
          code: data.code.replace(/\s/g, ''),
          isBackupCode: useBackupCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Code incorrect')
        return
      }

      // 2FA verified - redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError('Erreur de vérification. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendEmailOTP = async () => {
    if (!twoFactor || twoFactor.method !== 'EMAIL') return

    setIsLoading(true)
    try {
      // Re-trigger login to send new OTP
      const data = loginForm.getValues()
      await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setError(null)
      alert('Nouveau code envoyé par email')
    } catch {
      setError('Erreur lors de l\'envoi du code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin LLEDO Industries</h1>
          <p className="text-gray-400 mt-2">
            {twoFactor ? 'Vérification en deux étapes' : 'Connectez-vous à votre compte'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <AnimatePresence mode="wait">
            {!twoFactor ? (
              /* Login Form */
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      {...loginForm.register('email')}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="admin@lledo-industries.com"
                      disabled={isLoading}
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password')}
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="••••••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-400">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 text-sm">{error}</p>
                      {attemptsRemaining !== null && attemptsRemaining > 0 && (
                        <p className="text-red-400/70 text-xs mt-1">
                          {attemptsRemaining} tentative(s) restante(s)
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a
                    href="/admin/forgot-password"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              /* 2FA Form */
              <motion.form
                key="2fa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)}
                className="space-y-6"
              >
                {/* Method Info */}
                <div className="text-center p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                  <Shield className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">{twoFactor.message}</p>
                </div>

                {/* Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {useBackupCode ? 'Code de secours' : 'Code de vérification'}
                  </label>
                  <input
                    type="text"
                    {...twoFactorForm.register('code')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder={useBackupCode ? 'XXXX-XXXX' : '000000'}
                    maxLength={useBackupCode ? 9 : 6}
                    autoComplete="one-time-code"
                    disabled={isLoading}
                  />
                  {twoFactorForm.formState.errors.code && (
                    <p className="mt-1 text-sm text-red-400">
                      {twoFactorForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Toggle Backup Code */}
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setUseBackupCode(!useBackupCode)}
                    className="text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    {useBackupCode ? 'Utiliser le code normal' : 'Utiliser un code de secours'}
                  </button>
                  {twoFactor.method === 'EMAIL' && (
                    <button
                      type="button"
                      onClick={resendEmailOTP}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Renvoyer le code
                    </button>
                  )}
                </div>

                {/* Submit & Back Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Vérifier
                        <Shield className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactor(null)
                      setError(null)
                      twoFactorForm.reset()
                    }}
                    className="w-full py-3 px-4 bg-white/5 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all"
                  >
                    Retour
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} LLEDO Industries. Accès réservé aux administrateurs.
        </p>
      </motion.div>
    </div>
  )
}
