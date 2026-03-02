import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Biaggio Flooring - Premium Flooring & Bathroom Remodeling in Central Florida',
  description:
    'Premium flooring installation and bathroom remodeling in Central Florida. Over 15 years of craftsmanship, precision, and trusted service.',
}

export default function Home() {
  return <HomePage />
}
