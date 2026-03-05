import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Master the Art of Flooring Installation in the United States',
  description:
    'A practical guide for installers, contractors, and anyone who wants to master the craft of tile and flooring installation.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function BookPage() {
  return (
    <section className="py-20 bg-brand-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <p className="uppercase tracking-[0.35em] text-brand-charcoal/60 text-sm mb-4">
          Book
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-charcoal mb-4">
          Master the Art of Flooring Installation in the United States
        </h1>
        <p className="text-lg text-brand-charcoal/80 mb-8">
          A practical guide for installers, contractors, and anyone who wants to master the craft of tile and flooring installation.
        </p>

        <div className="rounded-3xl border border-brand-charcoal/10 bg-white p-8 shadow-premium">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-charcoal/60 mb-2">
              Authors
            </p>
            <p className="text-lg text-brand-charcoal">Rafael Biaggio</p>
            <p className="text-lg text-brand-charcoal">Milene Graciosa</p>
          </div>

          <div className="space-y-4 text-brand-charcoal/80">
            <p>
              Master the Art of Flooring Installation in the United States is a practical guide designed for tile installers,
              construction professionals, and anyone interested in learning professional flooring techniques.
            </p>
            <p>
              The book explains step by step how flooring installations work in real job sites across the United States. It covers
              materials, tools, preparation, layout techniques, and professional finishing methods used by experienced installers.
            </p>
            <p>
              Whether you are starting in the trade or looking to improve your skills, this guide provides practical knowledge that
              helps turn installation work into a professional craft.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-brand-charcoal mb-4">What You Will Learn</h2>
            <ul className="list-disc pl-6 space-y-2 text-brand-charcoal/80">
              <li>Types of tiles and materials</li>
              <li>Essential tools for professional installation</li>
              <li>Surface preparation techniques</li>
              <li>Tile layout and cutting methods</li>
              <li>Installation techniques used by professionals</li>
              <li>Grouting and finishing</li>
              <li>Material calculations</li>
              <li>How to estimate flooring projects</li>
              <li>Practical tips for working in the United States construction market</li>
            </ul>
          </div>

          <div className="mt-10">
            <a
              href="https://www.amazon.com/dp/B0FWZVT1T8?ref_=cm_sw_r_ffobk_cp_ud_dp_F0TXHY288NGS0RAP5CBS_1&bestFormat=true"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-4 text-lg font-semibold text-white hover:bg-brand-accent transition-colors"
            >
              Buy the Book on Amazon
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
