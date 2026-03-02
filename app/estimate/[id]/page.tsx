'use client'

import { useEffect, useMemo, useState } from 'react'
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
  areas?: Array<{ sqft: number }>
  breakdown?: {
    totalSqft: number
    baseTotal: number
    extrasTotal: number
    min: number
    max: number
  }
}

const formatCurrency = (value: number) => currencyFormatter.format(Math.ceil(value))

export default function EstimateResultPage({ params }: { params: { id: string } }) {
  const [snapshot, setSnapshot] = useState<EstimateSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = window.sessionStorage.getItem(`estimate:${params.id}`)
    if (stored) {
      try {
        setSnapshot(JSON.parse(stored) as EstimateSnapshot)
      } catch (error) {
        console.error('Failed to parse estimate snapshot:', error)
      }
    }
    setIsLoading(false)
  }, [params.id])

  useEffect(() => {
    if (isLoading || snapshot) {
      return
    }

    const fetchEstimate = async () => {
      try {
        const response = await fetch(`/api/estimate/${params.id}`)
        if (!response.ok) {
          return
        }
        const data = await response.json()
        setSnapshot({
          id: data.id,
          low: data.low,
          high: data.high,
          clientName: data.clientName,
          breakdown: data.breakdown,
        })
      } catch (error) {
        console.error('Failed to fetch estimate:', error)
      }
    }

    void fetchEstimate()
  }, [isLoading, params.id, snapshot])

  const content = useMemo(() => {
    if (isLoading) {
      return 'Loading your estimate...'
    }

    if (!snapshot) {
      return 'We could not find your estimate details. Please submit the form again.'
    }

    return null
  }, [isLoading, snapshot])

  return (
    <section className="py-24 bg-brand-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="uppercase tracking-[0.45em] text-brand-charcoal/60 text-sm mb-4">
          Estimate Result
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-brand-charcoal mb-6">
          {snapshot ? `Thank you, ${snapshot.clientName}.` : 'Estimate Result'}
        </h1>

        {content ? (
          <Card className="p-6 text-brand-charcoal/70">{content}</Card>
        ) : (
          <div className="space-y-6">
            <RangeResult range={`${formatCurrency(snapshot?.low ?? 0)} – ${formatCurrency(snapshot?.high ?? 0)}`} />

            <Card className="p-6">
              <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-4">
                Estimate Breakdown
              </p>
              <div className="space-y-2 text-brand-charcoal">
                <p>Total sqft: {snapshot?.breakdown?.totalSqft ?? 0}</p>
                <p>Base areas: {formatCurrency(snapshot?.breakdown?.baseTotal ?? 0)}</p>
                <p>Extras: {formatCurrency(snapshot?.breakdown?.extrasTotal ?? 0)}</p>
                <p>Final range: {formatCurrency(snapshot?.breakdown?.min ?? 0)} – {formatCurrency(snapshot?.breakdown?.max ?? 0)}</p>
              </div>
            </Card>

            <Disclaimer>
              This is a preliminary labor-only estimate. It is non-binding and subject to on-site verification.
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
