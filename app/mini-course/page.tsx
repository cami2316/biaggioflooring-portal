import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mini Course',
  description: 'Quick learning resources for remodeling planning and preparation.',
}

export default function MiniCoursePage() {
  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="uppercase tracking-[0.45em] text-brand-charcoal/70 text-sm mb-4">
          Mini Course
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-charcoal mb-6">
          Remodeling Planning Essentials
        </h1>
        <p className="text-lg text-brand-charcoal/80 mb-8">
          We are building a quick course to help you plan your flooring or bathroom remodel.
          In the meantime, request a labor-only estimate to start the conversation.
        </p>
        <Link
          href="/estimate"
          className="inline-flex rounded-full bg-brand-primary px-8 py-3 font-semibold text-white hover:bg-brand-accent transition"
        >
          Start Your Estimate
        </Link>
      </div>
    </section>
  )
}
