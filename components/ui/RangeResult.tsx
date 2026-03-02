import Card from '@/components/ui/Card'

type RangeResultProps = {
  label?: string
  range: string
}

const RangeResult = ({ label = 'Estimated Labor Investment', range }: RangeResultProps) => {
  return (
    <Card className="p-6">
      <p className="text-sm uppercase tracking-widest text-brand-charcoal/60 mb-2">{label}</p>
      <p className="text-3xl font-semibold text-brand-charcoal">
        {range}
      </p>
    </Card>
  )
}

export default RangeResult
