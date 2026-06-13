import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost'

const base =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

const styles: Record<Variant, string> = {
  primary: `${base} bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500`,
  danger:  `${base} text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500`,
  ghost:   `${base} text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus:ring-indigo-500`,
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
