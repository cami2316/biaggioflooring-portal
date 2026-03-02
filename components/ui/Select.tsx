import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      className={`w-full rounded-2xl border border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${className ?? ''}`.trim()}
    >
      {children}
    </select>
  )
})

Select.displayName = 'Select'

export default Select
