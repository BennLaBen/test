'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, Eye, EyeOff, Loader2, Shield, AlertCircle, ArrowRight,
  CheckCircle2, XCircle, AlertTriangle, Clock, RefreshCw, Key,
  Building2, Cpu, Cog
} from 'lucide-react'

// ============================================
// SCHEMAS
// ============================================

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().optional(),
})

const twoFactorSchema = z.object({
  code: z.string().min(6, 'Code à 6 chiffres requis').max(10),
  isBackupCode: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>
type TwoFactorFormData = z.infer<typeof twoFactorSchema>

// ============================================
// CONFETTI COMPONENT
// ============================================

function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: ['#0047FF', '#3b82f6', '#60a5fa', '#93c5fd', '#E61E2B'][Math.floor(Math.random() * 5)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            left: `${p.x}%`, 
            backgroundColor: p.color,
            top: -10,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// TOAST COMPONENT
// ============================================

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning'
  message: string
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  }

  const colors = {
    success: 'bg-green-500/10 border-green-500/30 text-green-300',
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl ${colors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="text-sm font-medium">{toast.message}</span>
            <button 
              onClick={() => onDismiss(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// OTP INPUT COMPONENT
// ============================================

function OTPInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled 
}: { 
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return
    
    const newValue = value.split('')
    newValue[index] = digit.slice(-1)
    const result = newValue.join('').slice(0, length)
    onChange(result)

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pastedData)
    if (pastedData.length === length) {
      inputRefs.current[length - 1]?.focus()
    } else {
      inputRefs.current[pastedData.length]?.focus()
    }
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <div key={i} className="relative">
          {i === 3 && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gray-500" />}
          <input
            ref={(el) => { inputRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            className="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold bg-white/5 border-2 border-white/20 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all disabled:opacity-50"
            aria-label={`Chiffre ${i + 1} du code`}
          />
        </div>
      ))}
    </div>
  )
}

// ============================================
// COUNTDOWN TIMER
// ============================================

function CountdownTimer({ 
  seconds, 
  onExpire, 
  label 
}: { 
  seconds: number
  onExpire: () => void
  label: string
}) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onExpire])

  const minutes = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Clock className="w-4 h-4" />
      <span>{label}</span>
      <span className={`font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
        {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  )
}

interface TwoFactorState {
  required: boolean
  method: 'TOTP' | 'EMAIL' | 'SMS'
  tempToken: string
  message: string
}

// ============================================
// MAIN LOGIN FORM COMPONENT
// ============================================

export function AdminLoginForm() {
  const router = useRouter()
  
  // Form states
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactor, setTwoFactor] = useState<TwoFactorState | null>(null)
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpExpired, setOtpExpired] = useState(false)
  
  // UI states
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  // Forms
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  // Toast helpers
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Shake animation trigger
  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
  }

  // Caps Lock detection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'))
  }

  // Email validation in real-time
  const emailValue = loginForm.watch('email')
  const isEmailValid = emailValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)

  // Login submit
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setFailedAttempts(prev => prev + 1)
        triggerShake()
        
        if (result.locked) {
          addToast('warning', result.error || 'Compte bloqué pour 30 minutes')
        } else {
          addToast('error', result.error || 'Email ou mot de passe incorrect')
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
        setOtpExpired(false)
        addToast('success', 'Code de vérification envoyé')
        return
      }

      // Login successful
      setShowConfetti(true)
      addToast('success', 'Connexion réussie ! Redirection...')
      
      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 1500)
    } catch {
      addToast('error', 'Erreur de connexion. Veuillez réessayer.')
      triggerShake()
    } finally {
      setIsLoading(false)
    }
  }

  // 2FA submit
  const onTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!twoFactor || otpValue.length < 6) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin-auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken: twoFactor.tempToken,
          code: otpValue.replace(/\s/g, ''),
          isBackupCode: useBackupCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        addToast('error', result.error || 'Code incorrect')
        triggerShake()
        setOtpValue('')
        return
      }

      // 2FA verified - success
      setShowConfetti(true)
      addToast('success', 'Connexion réussie ! Redirection...')
      
      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 1500)
    } catch {
      addToast('error', 'Erreur de vérification. Veuillez réessayer.')
      triggerShake()
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const resendEmailOTP = async () => {
    if (!twoFactor || twoFactor.method !== 'EMAIL') return

    setIsLoading(true)
    try {
      const data = loginForm.getValues()
      const response = await fetch('/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      if (result.requires2FA) {
        setTwoFactor(prev => prev ? { ...prev, tempToken: result.tempToken } : null)
        setOtpExpired(false)
        setOtpValue('')
        addToast('success', 'Nouveau code envoyé par email')
      }
    } catch {
      addToast('error', 'Erreur lors de l\'envoi du code')
    } finally {
      setIsLoading(false)
    }
  }

  // Get countdown duration based on method
  const getCountdownSeconds = () => {
    if (twoFactor?.method === 'EMAIL') return 600 // 10 minutes
    if (twoFactor?.method === 'TOTP') return 30 // 30 seconds
    return 300 // 5 minutes default
  }

  // Shake animation variants
  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <Confetti active={showConfetti} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <motion.div
              className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-2xl shadow-primary-500/30 mb-8">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4">
                LLEDO Industries
              </h1>
              <p className="text-xl text-gray-400 mb-12">
                Espace Administration Sécurisé
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 max-w-sm"
            >
              {[
                { icon: Shield, text: 'Authentification à deux facteurs' },
                { icon: Lock, text: 'Chiffrement de bout en bout' },
                { icon: Cpu, text: 'Surveillance des sessions actives' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-gray-300">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <feature.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Decorative gears */}
            <div className="absolute bottom-10 left-10 opacity-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Cog className="w-32 h-32 text-white" />
              </motion.div>
            </div>
            <div className="absolute top-10 right-10 opacity-20">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <Cog className="w-24 h-24 text-white" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 lg:bg-gray-950 p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            variants={shakeAnimation}
            className={`w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">LLEDO Industries</h1>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-400">
              <Lock className="w-4 h-4 text-green-400" />
              <span>Connexion sécurisée</span>
            </div>

            {/* Card */}
            <motion.div
              animate={isShaking ? 'shake' : undefined}
              variants={shakeAnimation}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                {!twoFactor ? (
                  /* ========== LOGIN FORM ========== */
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-5"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-white">Connexion Admin</h2>
                      <p className="text-gray-400 text-sm mt-1">
                        Connectez-vous à votre compte
                      </p>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Adresse email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...loginForm.register('email')}
                          className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            loginForm.formState.errors.email ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="admin@lledo-industries.com"
                          disabled={isLoading}
                          aria-invalid={loginForm.formState.errors.email ? 'true' : 'false'}
                        />
                        {isEmailValid && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                        )}
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-400" role="alert">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          {...loginForm.register('password')}
                          onKeyDown={handleKeyDown}
                          onKeyUp={handleKeyDown}
                          className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                            loginForm.formState.errors.password ? 'border-red-500' : 'border-white/10'
                          }`}
                          placeholder="••••••••••••"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Caps Lock Warning */}
                      {capsLockOn && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-yellow-400 flex items-center gap-1"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Caps Lock activé
                        </motion.p>
                      )}
                      
                      {loginForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-400" role="alert">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          {...loginForm.register('rememberMe')}
                          className="w-4 h-4 rounded border-gray-600 bg-white/5 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                        />
                        Se souvenir de moi
                      </label>
                      <a
                        href="/admin/forgot-password"
                        className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        Mot de passe oublié ?
                      </a>
                    </div>

                    {/* Captcha Notice (after 3 failures) */}
                    {failedAttempts >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Vérification de sécurité activée
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
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
                  /* ========== 2FA FORM ========== */
                  <motion.form
                    key="2fa"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={onTwoFactorSubmit}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 border border-primary-500/30 mb-4"
                      >
                        <Shield className="w-8 h-8 text-primary-400" />
                      </motion.div>
                      <h2 className="text-xl font-bold text-white">Vérification en deux étapes</h2>
                      <p className="text-gray-400 text-sm mt-2">{twoFactor.message}</p>
                    </div>

                    {/* 2FA Badge */}
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        Authentification à deux facteurs active
                      </span>
                    </div>

                    {/* OTP Input */}
                    {!useBackupCode ? (
                      <div className="space-y-4">
                        <OTPInput
                          length={6}
                          value={otpValue}
                          onChange={setOtpValue}
                          disabled={isLoading}
                        />
                        
                        {/* Countdown Timer */}
                        {!otpExpired && (
                          <div className="flex justify-center">
                            <CountdownTimer
                              seconds={getCountdownSeconds()}
                              onExpire={() => setOtpExpired(true)}
                              label={twoFactor.method === 'TOTP' ? 'Code valide' : 'Code expire dans'}
                            />
                          </div>
                        )}

                        {/* Expired message */}
                        {otpExpired && twoFactor.method === 'EMAIL' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-yellow-400 text-sm"
                          >
                            Code expiré.{' '}
                            <button
                              type="button"
                              onClick={resendEmailOTP}
                              disabled={isLoading}
                              className="underline hover:no-underline"
                            >
                              Renvoyer un nouveau code
                            </button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      /* Backup Code Input */
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                          Code de secours
                        </label>
                        <input
                          type="text"
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl tracking-widest font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="XXXX-XXXX"
                          maxLength={9}
                          disabled={isLoading}
                        />
                      </div>
                    )}

                    {/* Toggle Backup Code */}
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setUseBackupCode(!useBackupCode)
                          setOtpValue('')
                        }}
                        className="flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <Key className="w-4 h-4" />
                        {useBackupCode ? 'Utiliser le code normal' : 'Utiliser un code de secours'}
                      </button>
                    </div>

                    {/* Resend Button (for EMAIL) */}
                    {twoFactor.method === 'EMAIL' && !otpExpired && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={resendEmailOTP}
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                          Renvoyer le code
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || otpValue.length < 6}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
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

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactor(null)
                        setOtpValue('')
                        setOtpExpired(false)
                        setUseBackupCode(false)
                      }}
                      className="w-full py-3 px-4 bg-white/5 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all"
                    >
                      Retour à la connexion
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                Vos données sont protégées •{' '}
                <a href="/privacy" className="text-primary-400 hover:underline">En savoir plus</a>
              </p>
              <p className="text-gray-600 text-xs mt-2">
                © {new Date().getFullYear()} LLEDO Industries. Accès réservé aux administrateurs.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS for shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  )
}
