import type { PropsWithChildren } from 'react'

import Card from '@/components/ui/Card'

type DisclaimerProps = PropsWithChildren<{
  title?: string
  className?: string
}>

const Disclaimer = ({ title = 'Disclaimer', className, children }: DisclaimerProps) => {
  return (
    <Card className={`p-6 text-sm text-brand-charcoal/80 ${className ?? ''}`.trim()}>
      <p className="font-semibold text-brand-charcoal mb-3">{title}</p>
      <p>{children}</p>
    </Card>
  )
}

export default Disclaimer
