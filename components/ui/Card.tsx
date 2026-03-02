import type { PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<{
  className?: string
}>

const Card = ({ className, children }: CardProps) => {
  return (
    <div className={`rounded-3xl border border-brand-charcoal/10 bg-white shadow-premium ${className ?? ''}`.trim()}>
      {children}
    </div>
  )
}

export default Card
