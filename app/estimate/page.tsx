import type { Metadata } from 'next'

import EstimatePageShell from '@/components/EstimatePageShell'

export const metadata: Metadata = {
  title: 'Labor Estimate Calculator',
  description:
    'Submit your project details for a preliminary labor-only estimate range from Biaggio Flooring.',
}

export default function EstimatePage() {
  return (
    <EstimatePageShell
      eyebrow="Labor Only Estimate"
      title="Get a labor estimate for your project"
      description="Share project details to receive an instant labor-only estimate range based on our minimums."
      redirectBase="/estimate"
    />
  )
}
