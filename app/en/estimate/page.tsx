import type { Metadata } from 'next'

import EstimatePageShell from '@/components/EstimatePageShell'

export const metadata: Metadata = {
  title: 'Labor Estimate',
  description:
    'Request a preliminary labor-only estimate for your remodeling project.',
}

export default function EstimateEnPage() {
  return (
    <EstimatePageShell
      eyebrow="Labor Only Estimate"
      title="Get a labor estimate for your project"
      description="Share project details to receive an instant labor-only estimate range based on our minimums."
      redirectBase="/en/estimate"
    />
  )
}
