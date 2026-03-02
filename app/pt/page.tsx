import type { Metadata } from 'next'

import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Biaggio Flooring | Home (PT)',
  description:
    'Premium flooring and bathroom remodeling in Central Florida. Portuguese route placeholder content.',
}

export default function PortugueseHome() {
  return <HomePage />
}
