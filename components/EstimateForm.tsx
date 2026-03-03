'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'

import { calculateLaborRange } from '@/lib/pricing'
import { emailRegex, phoneRegex, type AreaType, type EstimateInput } from '@/lib/validations'
import {
  Alert,
  Button,
  Card,
  Disclaimer,
  Input,
  RangeResult,
  Select,
  Stepper,
  Toast,
} from '@/components/ui'

type EstimateFormValues = EstimateInput

const steps = ['Project Info', 'Areas', 'Review']

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const formatCurrency = (value: number) => currencyFormatter.format(Math.ceil(value))

type EstimateFormProps = {
  redirectBase?: string
}

const EstimateForm = ({ redirectBase = '/estimate' }: EstimateFormProps) => {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [status, setStatus] = useState<{ message: string; variant: 'info' | 'error' } | null>(null)
  const [retryPayload, setRetryPayload] = useState<EstimateFormValues | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<EstimateFormValues>({
    defaultValues: {
      clientName: '',
      email: '',
      phone: '',
      address: '',
      areas: [
        {
          type: 'floor',
          sqft: 0,
          material: 'ceramic',
          tileSize: '',
          layout: '',
          surface: 'floor',
          extras: {
            demolition: false,
            cementBoard: false,
            bench: false,
            niches: 0,
            window: false,
          },
        },
      ],
    },
    mode: 'onChange',
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'areas',
  })

  const areas = watch('areas')
  const clientName = watch('clientName')
  const email = watch('email')
  const phone = watch('phone')
  const address = watch('address')
  const estimate = useMemo(() => calculateLaborRange({
    clientName,
    email,
    phone,
    address,
    areas,
  }), [clientName, email, phone, address, areas])
  const hasAtLeastOneValidArea = areas.some((area) => Number(area.sqft) > 0)
  const isEstimateReady = useMemo(() => {
    if (!areas.length) {
      return false
    }

    const hasPositive = areas.some((area) => Number.isFinite(area.sqft) && area.sqft > 0)
    const allNonNegative = areas.every((area) => Number.isFinite(area.sqft) && area.sqft >= 0)

    return hasPositive && allNonNegative
  }, [areas])

  useEffect(() => {
    setIsCalculating(true)
    const timer = window.setTimeout(() => setIsCalculating(false), 200)
    return () => window.clearTimeout(timer)
  }, [areas])

  const step0Valid = useMemo(() => {
    return Boolean(
      clientName.trim() &&
      emailRegex.test(email.trim()) &&
      phoneRegex.test(phone.trim()) &&
      address.trim()
    )
  }, [clientName, email, phone, address])

  const step1Valid = useMemo(() => {
    if (!areas.length) {
      return false
    }

    const hasPositive = areas.some((area) => Number.isFinite(area.sqft) && area.sqft > 0)
    const allNonNegative = areas.every((area) => Number.isFinite(area.sqft) && area.sqft >= 0)

    return hasPositive && allNonNegative
  }, [areas])

  const handleNext = async () => {
    setStatus(null)

    if (step === 0) {
      const isValid = await trigger(['clientName', 'email', 'phone', 'address'])
      if (!isValid) {
        return
      }
    }

    if (step === 1) {
      const isValid = await trigger('areas')
      if (!isValid) {
        return
      }
    }

    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setStatus(null)
    setStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = async (values: EstimateFormValues) => {
    setStatus(null)

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const payload = await response.json()

      if (!response.ok) {
        setStatus({
          message: payload?.error ?? 'Submission failed. Please try again.',
          variant: 'error',
        })
        return
      }

      const estimateId = typeof payload?.id === 'string' ? payload.id : ''
      if (!estimateId) {
        setStatus({
          message: 'Estimate ID missing from response. Please try again.',
          variant: 'error',
        })
        return
      }

      const snapshot = {
        id: estimateId,
        low: payload.range?.min ?? 0,
        high: payload.range?.max ?? 0,
        breakdown: payload.breakdown,
        areas: values.areas,
        clientName: values.clientName.trim(),
      }

      window.sessionStorage.setItem(`estimate:${estimateId}`, JSON.stringify(snapshot))
      router.push(`${redirectBase}/${estimateId}`)
    } catch (error) {
      console.error('Failed to submit estimate request:', error)
      setRetryPayload(values)
      setStatus({
        message: 'Network error. Please retry your submission.',
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    if (retryPayload) {
      void onSubmit(retryPayload)
    }
  }

  return (
    <Card className="w-full p-8 md:p-10">
      <Stepper step={step} total={steps.length} label={steps[step]} />

      {isSubmitting ? (
        <Alert className="mb-6">Submitting your estimate...</Alert>
      ) : null}

      {status ? (
        <Alert className="mb-6" variant={status.variant}>{status.message}</Alert>
      ) : null}

      {status?.variant === 'error' ? (
        <Toast variant="error">
          {status.message}
          {retryPayload ? (
            <button
              type="button"
              onClick={handleRetry}
              className="ml-3 underline"
            >
              Retry
            </button>
          ) : null}
        </Toast>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-2">Full Name</label>
              <Input
                type="text"
                {...register('clientName', { required: 'Please enter your full name.' })}
                placeholder="John Doe"
              />
              {errors.clientName ? (
                <p className="mt-2 text-sm text-red-600">{errors.clientName.message}</p>
              ) : null}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">Email</label>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Please enter a valid email address.',
                    pattern: { value: emailRegex, message: 'Please enter a valid email address.' },
                  })}
                  placeholder="you@email.com"
                />
                {errors.email ? (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-charcoal mb-2">Phone</label>
                <Input
                  type="tel"
                  {...register('phone', {
                    required: 'Please enter a phone number.',
                    pattern: { value: phoneRegex, message: 'Phone must be numeric.' },
                  })}
                  placeholder="(407) 555-0199"
                />
                {errors.phone ? (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-2">Project Address</label>
              <Input
                type="text"
                {...register('address', { required: 'Please enter the project address.' })}
                placeholder="1234 Winter Park Rd, Orlando, FL"
              />
              {errors.address ? (
                <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            {fields.map((area, index) => (
              <Card key={area.id} className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-brand-charcoal/70">Area {index + 1}</p>
                    <h3 className="text-lg font-semibold text-brand-charcoal">Project Area Details</h3>
                  </div>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove Area
                    </button>
                  ) : null}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-brand-charcoal mb-2">Area Type</label>
                    <Select
                      {...register(`areas.${index}.type` as const)}
                      onChange={(event) => {
                        const nextType = event.target.value as AreaType
                        const current = areas[index]
                        update(index, {
                          ...current,
                          type: nextType,
                          surface: nextType === 'shower' ? current.surface ?? 'floor' : 'floor',
                          material: nextType === 'floor' ? 'ceramic' : current.material,
                        })
                      }}
                    >
                      <option value="floor">Floor</option>
                      <option value="wall">Wall</option>
                      <option value="backsplash">Backsplash</option>
                      <option value="shower">Shower</option>
                    </Select>
                  </div>

                  {areas[index]?.type === 'shower' ? (
                    <div>
                      <label className="block text-sm font-semibold text-brand-charcoal mb-2">Shower Surface</label>
                      <Select
                        {...register(`areas.${index}.surface` as const)}
                      >
                        <option value="floor">Shower Floor (Compacted Pan)</option>
                        <option value="wall">Shower Wall</option>
                      </Select>
                    </div>
                  ) : null}

                  <div>
                    <label className="block text-sm font-semibold text-brand-charcoal mb-2">Square Footage</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`areas.${index}.sqft` as const, {
                        min: { value: 0, message: 'Square footage must be 0 or greater.' },
                        valueAsNumber: true,
                      })}
                      placeholder="0"
                    />
                    {errors.areas?.[index]?.sqft ? (
                      <p className="mt-2 text-sm text-red-600">{errors.areas[index]?.sqft?.message}</p>
                    ) : null}
                  </div>

                  {areas[index]?.type === 'floor' ? (
                    <div>
                      <label className="block text-sm font-semibold text-brand-charcoal mb-2">Floor Material</label>
                      <Select
                        {...register(`areas.${index}.material` as const)}
                      >
                        <option value="ceramic">Ceramic</option>
                        <option value="porcelain">Porcelain</option>
                        <option value="marble">Marble</option>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-semibold text-brand-charcoal mb-2">
                        {areas[index]?.type === 'shower' ? 'Shower Material' : 'Material'}
                      </label>
                      <Input
                        type="text"
                        {...register(`areas.${index}.material` as const)}
                        placeholder="Porcelain tile"
                      />
                      {errors.areas?.[index]?.material ? (
                        <p className="mt-2 text-sm text-red-600">{errors.areas[index]?.material?.message}</p>
                      ) : null}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-brand-charcoal mb-2">Tile Size</label>
                    <Select {...register(`areas.${index}.tileSize` as const)}>
                      <option value="">Select size</option>
                      <option value="12x12">12" x 12"</option>
                      <option value="12x24">12" x 24"</option>
                      <option value="18x18">18" x 18"</option>
                      <option value="24x24">24" x 24"</option>
                      <option value="6x24">6" x 24"</option>
                      <option value="8x36">8" x 36"</option>
                      <option value="6x36">6" x 36"</option>
                      <option value="4x12">4" x 12"</option>
                      <option value="3x6">3" x 6" (Subway)</option>
                      <option value="2x2">2" x 2" (Mosaic)</option>
                      <option value="1x1">1" x 1" (Mosaic)</option>
                      <option value="2x8">2" x 8"</option>
                      <option value="3x12">3" x 12"</option>
                      <option value="4x16">4" x 16"</option>
                      <option value="48x48">48" x 48" (Large Format)</option>
                      <option value="other">Other (please specify in notes)</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-brand-charcoal mb-2">Layout</label>
                    <Select
                      {...register(`areas.${index}.layout` as const)}
                    >
                      <option value="">Select layout</option>
                      <option value="diagonal">Diagonal Lay</option>
                      <option value="stacked straight">Stacked Straight Lay (horizontal or vertical)</option>
                      <option value="brick">Brick Pattern (Running Bond)</option>
                      <option value="herringbone">Herringbone (straight or diagonal)</option>
                      <option value="offset">Off set / 1/3 off set</option>
                      <option value="chevron">Chevron</option>
                      <option value="basket weave">Basket Weave</option>
                      <option value="crosshatch">Crosshatch</option>
                      <option value="versailles">Versailles (French Pattern)</option>
                      <option value="pinwheel">Pinwheel</option>
                      <option value="staggered">Staggered Joint</option>
                      <option value="hexagon">Hexagon Layout</option>
                      <option value="diamond">Diamond</option>
                      <option value="corridor">Corridor</option>
                      <option value="other">Other (please specify in notes)</option>
                    </Select>
                    {errors.areas?.[index]?.layout ? (
                      <p className="mt-2 text-sm text-red-600">{errors.areas[index]?.layout?.message}</p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-brand-charcoal">Core Extras</p>
                    <label className="flex items-center gap-3 text-sm text-brand-charcoal">
                      <input
                        type="checkbox"
                        {...register(`areas.${index}.extras.demolition` as const)}
                        className="h-4 w-4"
                      />
                      Demolition Required
                    </label>
                    <label className="flex items-center gap-3 text-sm text-brand-charcoal">
                      <input
                        type="checkbox"
                        {...register(`areas.${index}.extras.cementBoard` as const)}
                        className="h-4 w-4"
                      />
                      Cement Board
                    </label>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-brand-charcoal">Shower Extras</p>
                    <label className="flex items-center gap-3 text-sm text-brand-charcoal">
                      <input
                        type="checkbox"
                        {...register(`areas.${index}.extras.bench` as const)}
                        className="h-4 w-4"
                      />
                      Shower Bench
                    </label>
                    <label className="flex items-center gap-3 text-sm text-brand-charcoal">
                      <input
                        type="checkbox"
                        {...register(`areas.${index}.extras.window` as const)}
                        className="h-4 w-4"
                      />
                      Window
                    </label>
                    <div>
                      <label className="block text-sm font-semibold text-brand-charcoal mb-2">Niches</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        {...register(`areas.${index}.extras.niches` as const, {
                          min: { value: 0, message: 'Niche count cannot be negative.' },
                          valueAsNumber: true,
                        })}
                        placeholder="0"
                      />
                      {errors.areas?.[index]?.extras?.niches ? (
                        <p className="mt-2 text-sm text-red-600">{errors.areas[index]?.extras?.niches?.message}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  type: 'floor',
                  sqft: 0,
                  material: 'ceramic',
                  tileSize: '',
                  layout: '',
                  surface: 'floor',
                  extras: {
                    demolition: false,
                    cementBoard: false,
                    bench: false,
                    niches: 0,
                    window: false,
                  },
                })
              }
              variant="secondary"
              className="inline-flex items-center gap-2"
            >
              + Add Another Area
            </Button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-8">
            {isCalculating ? (
              <Alert>Calculating...</Alert>
            ) : isEstimateReady ? (
              <div className="animate-fadeIn">
                <RangeResult range={`${formatCurrency(estimate.min)} – ${formatCurrency(estimate.max)}`} />
              </div>
            ) : (
              <Alert>Complete all required fields to see your estimate.</Alert>
            )}

            <Disclaimer>
              This is a preliminary labor-only estimate based on the information provided.
              It is non-binding and cannot be used as a contractual quote.
              Final pricing requires on-site verification and may vary depending on layout complexity, subfloor condition, and job site factors.
            </Disclaimer>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {step > 0 ? (
            <Button type="button" onClick={handleBack} variant="secondary">
              Back
            </Button>
          ) : null}

          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !hasAtLeastOneValidArea}
            >
              {step === 0 ? 'Next: Project Details' : 'Calculate Estimate'}
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || !step1Valid}>
              {isSubmitting ? 'Submitting...' : 'Request Estimate'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default EstimateForm
