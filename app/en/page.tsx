import type { Metadata } from 'next'

import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Biaggio Flooring | Home (EN)',
  description:
    'Premium flooring and bathroom remodeling in Central Florida. English route home page.',
}

export default function EnglishHome() {
  return <HomePage />
}
