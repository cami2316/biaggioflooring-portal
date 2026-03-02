import type { Metadata } from 'next'

import AuthForm from '@/components/AuthForm'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Admin access for Biaggio Flooring estimate management.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <AuthForm />
      </div>
    </section>
  )
}
