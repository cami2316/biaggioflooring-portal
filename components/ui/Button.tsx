import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  const base = 'rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70'
  const styles = variant === 'primary'
    ? 'bg-brand-primary text-white shadow-md hover:bg-brand-accent'
    : 'border border-brand-charcoal/20 text-brand-charcoal hover:border-brand-primary hover:text-brand-primary'

  return (
    <button
      {...props}
      className={`${base} ${styles} ${className ?? ''}`.trim()}
    />
  )
}

export default Button
