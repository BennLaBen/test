import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

export const metadata = {
  title: 'Connexion Admin - LLEDO Industries',
  description: 'Espace de connexion réservé aux administrateurs LLEDO Industries',
  robots: 'noindex, nofollow',
}

export default function AdminLoginPage() {
  return <AdminLoginForm />
}
