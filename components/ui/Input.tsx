import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded-2xl border border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${className ?? ''}`.trim()}
    />
  )
})

Input.displayName = 'Input'

export default Input
