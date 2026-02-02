'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { signIn, getSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Mail, 
  Lock, 
  LogIn, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Building2
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function ConnexionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const errorParam = searchParams.get('error')
  
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('common')
  const [error, setError] = useState(errorParam === 'admin_required' ? t('auth.adminRequired') : '')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(t('auth.invalidCredentials'))
      } else {
        // Get session to check user role
        const session = await getSession()
        
        // Redirect admin users to admin dashboard
        if (session?.user?.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push(callbackUrl)
        }
        router.refresh()
      }
    } catch (err) {
      setError(t('ui.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title={t('auth.login')}
        description={t('auth.loginSubtitle')}
      />

      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-muted-strong">{t('auth.login')}</h1>
              <p className="text-muted mt-2">{t('auth.loginSubtitle')}</p>
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
              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  {t('auth.email')}
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

              <div>
                <label className="block text-sm font-medium text-muted-strong mb-2">
                  <Lock className="h-4 w-4 inline mr-2" />
                  {t('auth.password')}
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

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('auth.connecting')}
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    {t('auth.login')}
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-muted">
                {t('auth.noAccountSignup').split('?')[0]}?{' '}
                <Link href="/inscription" className="text-primary-600 hover:text-primary-700 font-medium">
                  {t('auth.createAccount')}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
