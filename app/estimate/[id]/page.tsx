import Link from 'next/link'

import { Button, Card, Disclaimer, RangeResult } from '@/components/ui'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type EstimateSnapshot = {
  id: string
  low: number
  high: number
  clientName: string
}

const formatCurrency = (value: number) => currencyFormatter.format(Math.ceil(value))

const getBaseUrl = () => {
  if (process.env.PUBLIC_BASE_URL) {
    return process.env.PUBLIC_BASE_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return 'http://localhost:3000'
}

export default async function EstimateResultPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return (
      <section className="py-24 bg-brand-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-6 text-brand-charcoal/70">
            We could not find your estimate details. Please submit the form again.
          </Card>
        </div>
      </section>
    )
  }

  let snapshot: EstimateSnapshot | null = null
  try {
    const response = await fetch(`${getBaseUrl()}/api/estimate/${id}`, { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      snapshot = {
        id: data.id,
        low: data.low,
        high: data.high,
        clientName: data.clientName,
      }
    }
  } catch (error) {
    console.error('Failed to fetch estimate:', error)
  }

  const firstName = snapshot?.clientName?.split(' ')[0] || 'there'

  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="uppercase tracking-[0.45em] text-brand-charcoal/60 text-sm mb-4">
          Estimate Result
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-charcoal mb-6">
          {snapshot ? `Thank you, ${firstName}.` : 'Estimate Result'}
        </h1>

        {!snapshot ? (
          <Card className="p-6 text-brand-charcoal/70">
            We could not find your estimate details. Please submit the form again.
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-3">
                Estimated labor investment
              </p>
              <RangeResult range={`${formatCurrency(snapshot.low)} – ${formatCurrency(snapshot.high)}`} />
            </Card>

            <Disclaimer>
              This is a preliminary labor-only estimate. We will follow up to confirm details.
            </Disclaimer>
          </div>
        )}

        <div className="mt-10">
          <Link href="/estimate">
            <Button variant="secondary">Start New Estimate</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
