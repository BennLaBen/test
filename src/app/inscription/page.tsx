'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Mail, 
  Lock, 
  User,
  Building2,
  Phone,
  UserPlus, 
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const registerSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  company: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function InscriptionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { t } = useTranslation('common')

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          company: data.company,
          phone: data.phone,
        })
      })

      const result = await res.json()

      if (result.success) {
        // Auto login after registration
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        if (signInResult?.error) {
          setSuccess(true)
        } else {
          router.push('/espace-client')
          router.refresh()
        }
      } else {
        setError(result.error || t('auth.registerError'))
      }
    } catch (err) {
      setError(t('ui.error'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <SEO title={t('auth.registerSuccess')} />
        <section className="min-h-screen flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 text-center max-w-md"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-muted-strong mb-4">{t('auth.accountCreatedTitle')}</h1>
            <p className="text-muted mb-6">
              {t('auth.accountCreated')}. {t('auth.canNowLogin')}.
            </p>
            <Link href="/connexion" className="btn-primary">
              {t('auth.login')}
            </Link>
          </motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEO
        title={t('auth.register')}
        description={t('auth.registerSubtitle')}
      />

      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="glass-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-muted-strong">{t('auth.createAccount')}</h1>
              <p className="text-muted mt-2">{t('auth.registerSubtitle')}</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-strong mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    {t('auth.firstName')} *
                  </label>
                  <input
                    {...register('firstName')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Prénom"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-strong mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    {t('auth.lastName')} *
                  </label>
                  <input
                    {...register('lastName')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nom"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  {t('auth.email')} *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-strong mb-2">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    {t('auth.company')}
                  </label>
                  <input
                    {...register('company')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-strong mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {t('auth.phone')}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  {t('auth.password')} *
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  {t('auth.confirmPassword')} *
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('auth.creating')}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    {t('auth.createAccount')}
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-muted">
                {t('auth.alreadyHaveAccountLogin').split('?')[0]}?{' '}
                <Link href="/connexion" className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
