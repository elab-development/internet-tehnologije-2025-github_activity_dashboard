import { HTMLAttributes } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white border border-slate-100 shadow-sm rounded-xl p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
