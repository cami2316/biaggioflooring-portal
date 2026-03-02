import type { PropsWithChildren } from 'react'

type AlertProps = PropsWithChildren<{
  variant?: 'info' | 'error' | 'success'
  className?: string
}>

const styles: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'border-brand-charcoal/10 bg-brand-white text-brand-charcoal',
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const Alert = ({ variant = 'info', className, children }: AlertProps) => {
  return (
    <div className={`rounded-2xl border px-5 py-4 text-sm ${styles[variant]} ${className ?? ''}`.trim()}>
      {children}
    </div>
  )
}

export default Alert
