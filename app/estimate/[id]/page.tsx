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

  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="uppercase tracking-[0.45em] text-brand-charcoal/60 text-sm mb-4">
          Estimate Submitted
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-charcoal mb-6">
          Estimate Submitted
        </h1>

        {!snapshot ? (
          <Card className="p-6 text-brand-charcoal/70">
            We could not find your estimate details. Please submit the form again.
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-3">
                Estimated Total
              </p>
              <RangeResult range={`${formatCurrency(snapshot.low)} – ${formatCurrency(snapshot.high)}`} />
            </Card>

            <div className="mt-8 rounded-lg border border-yellow-300 bg-yellow-50 p-6 text-center">
              <p className="text-xl font-semibold">
                Important: please check your SPAM folder for our email.
              </p>
            </div>

            <p className="text-base text-brand-charcoal/80">
              We will contact you soon to confirm details and finalize your quote.
            </p>

            <Disclaimer>
              This is a preliminary labor-only estimate.
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
