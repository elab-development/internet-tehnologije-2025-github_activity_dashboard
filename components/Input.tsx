import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

const base =
  'w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 ' +
  'text-zinc-100 placeholder:text-zinc-500 ' +
  'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ' +
  'transition-colors'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${base} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${base} resize-none ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${base} ${className}`} {...props}>
      {children}
    </select>
  )
}
