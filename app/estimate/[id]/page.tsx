import Link from 'next/link'

import { Button, Card, Disclaimer, RangeResult } from '@/components/ui'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatCurrency = (value: number) => currencyFormatter.format(Math.ceil(value))
export default async function EstimateResultPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams: { submitted?: string; min?: string; max?: string } }
) {
  const { id } = await params
  const minValue = Number(searchParams.min)
  const maxValue = Number(searchParams.max)
  const hasRange = Number.isFinite(minValue) && Number.isFinite(maxValue)

  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="uppercase tracking-[0.45em] text-brand-charcoal/60 text-sm mb-4">
          Estimate Submitted
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-charcoal mb-6">
          Estimate Submitted
        </h1>

        <div className="space-y-6">
          {hasRange ? (
            <Card className="p-6">
              <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-3">
                Estimated Total
              </p>
              <RangeResult range={`${formatCurrency(minValue)} – ${formatCurrency(maxValue)}`} />
            </Card>
          ) : null}

          <div className="mt-8 rounded-lg border border-yellow-300 bg-yellow-50 p-6 text-center">
            <p className="text-xl font-semibold">
              We sent your estimate by email. Please check your SPAM folder as well.
            </p>
          </div>

          <p className="text-base text-brand-charcoal/80">
            Biaggio Flooring will contact you soon to confirm details and finalize your quote.
          </p>

          <Disclaimer>
            This is a preliminary labor-only estimate.
          </Disclaimer>
        </div>

        <div className="mt-10">
          <Link href="/estimate">
            <Button variant="secondary">Start New Estimate</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
