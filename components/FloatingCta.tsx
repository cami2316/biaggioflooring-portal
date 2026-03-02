'use client'

import { useState } from 'react'
import Link from 'next/link'

const FloatingCta = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleBookClick = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'book_click', {
        event_category: 'outbound',
        event_label: 'amazon_book',
      })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      <div className="flex flex-col items-end gap-3">
        <div
          className={`origin-bottom-right transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
        >
          <div className="rounded-2xl border border-brand-charcoal/30 bg-brand-charcoal/95 px-4 py-3 shadow-premium backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-brand-white/70 mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/estimate"
                className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-accent transition"
              >
                Get Your Estimate
              </Link>
              <a
                href="https://www.amazon.com/Domine-Instala%C3%A7%C3%A3o-Estados-Unidos-Portuguese-ebook/dp/B0FWYKGZ5L/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Buy Domine a Arte da Instalacao de Pisos on Amazon"
                onClick={handleBookClick}
                className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-brand-accent"
              >
                Buy the Book ↗
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse quick actions' : 'Expand quick actions'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-charcoal/20 bg-white text-brand-charcoal shadow-premium transition hover:border-brand-primary hover:text-brand-primary sm:h-10 sm:w-10 md:h-11 md:w-11"
          >
            <span className={`text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`}>▴</span>
          </button>
          <Link
            href="/estimate"
            className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-brand-accent sm:px-5 sm:py-3 md:px-6 md:py-3 md:text-sm"
          >
            Get Your Estimate
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FloatingCta
