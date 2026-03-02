import type { Metadata } from 'next'

import AdminDashboard from '@/components/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Private dashboard for Biaggio Flooring estimate requests.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminDashboardPage() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 space-y-6">
        <div>
          <p className="uppercase tracking-[0.4em] text-brand-charcoal/60 text-sm mb-2">Admin</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
            Estimate Dashboard
          </h1>
        </div>

        <AdminDashboard />
      </div>
    </section>
  )
}
