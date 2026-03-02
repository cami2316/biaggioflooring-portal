import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className={`w-full rounded-2xl border border-brand-charcoal/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 ${className ?? ''}`.trim()}
    />
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
