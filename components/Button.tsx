import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-inset ' +
  'disabled:opacity-40 disabled:cursor-not-allowed'

const styles: Record<Variant, string> = {
  primary:
    `${base} bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 focus:ring-indigo-400`,
  secondary:
    `${base} bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 active:bg-zinc-600 focus:ring-zinc-500`,
  danger:
    `${base} text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 active:bg-rose-900/60 focus:ring-rose-500`,
  ghost:
    `${base} text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 active:bg-zinc-700 focus:ring-zinc-500`,
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
