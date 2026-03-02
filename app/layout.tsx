import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCta from '@/components/FloatingCta'

const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
})

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Project Estimate | Biaggio-style',

  description:
    'Get a labor-only estimate for your flooring & tile project',

  keywords: [
    'flooring installation Orlando',
    'bathroom remodeling Central Florida',
    'tile installation',
    'shower remodeling',
    'hardwood flooring Orlando',
  ],

  openGraph: {
    title: 'Project Estimate | Biaggio-style',
    description:
      'Get a labor-only estimate for your flooring & tile project',
    url: 'https://biaggioflooring.com',
    siteName: 'Biaggio Flooring',
    images: [
      {
        url: '/images/hero/place_1.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  alternates: {
    languages: {
      en: '/en',
      pt: '/pt',
    },
  },

  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} scroll-smooth`}
    >
      <body className="bg-brand-white text-brand-charcoal antialiased">

        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <main className="min-h-screen flex flex-col">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

        {/* FLOATING CTA */}
        <FloatingCta />

      </body>
    </html>
  )
}
