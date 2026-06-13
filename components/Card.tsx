import { HTMLAttributes } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border p-3 rounded ${className}`} {...props}>
      {children}
    </div>
  )
}
