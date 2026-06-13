import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost'

const styles: Record<Variant, string> = {
  primary: 'bg-black text-white rounded',
  danger: 'text-red-600',
  ghost: '',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button className={`${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}