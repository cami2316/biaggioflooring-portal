type StepperProps = {
  step: number
  total: number
  label: string
}

const Stepper = ({ step, total, label }: StepperProps) => {
  const progress = Math.round(((step + 1) / total) * 100)

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-2 text-sm text-brand-charcoal/70 mb-3 sm:flex-row sm:items-center sm:justify-between">
        <span>Step {step + 1} of {total}</span>
        <span className="text-brand-charcoal/70">{label}</span>
      </div>
      <div className="h-2 w-full bg-brand-charcoal/10 rounded-full overflow-hidden">
        <div className="h-full bg-brand-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default Stepper
