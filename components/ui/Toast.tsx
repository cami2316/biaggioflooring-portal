import type { PropsWithChildren } from 'react'

type ToastProps = PropsWithChildren<{
  variant?: 'error' | 'info' | 'success'
}>

const styles: Record<NonNullable<ToastProps['variant']>, string> = {
  error: 'bg-red-600 text-white',
  info: 'bg-brand-charcoal text-white',
  success: 'bg-emerald-600 text-white',
}

const Toast = ({ variant = 'info', children }: ToastProps) => {
  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm rounded-2xl px-4 py-3 text-sm shadow-xl sm:right-6">
      <div className={`${styles[variant]} rounded-2xl px-4 py-3`}>{children}</div>
    </div>
  )
}

export default Toast
