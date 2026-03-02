import type { Metadata } from 'next'
import Link from 'next/link'

import AdminDashboard from '@/components/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Private dashboard for Biaggio Flooring estimate requests.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="uppercase tracking-[0.4em] text-brand-charcoal/60 text-sm mb-2">Admin</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-brand-charcoal">
              Estimate Requests
            </h1>
          </div>
          <Link
            href="/auth"
            className="rounded-full border border-brand-charcoal/20 px-6 py-3 text-sm font-semibold text-brand-charcoal hover:border-brand-primary hover:text-brand-primary transition"
          >
            Admin Login
          </Link>
        </div>

        <AdminDashboard />
      </div>
    </section>
  )
}
