import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

const base =
  'w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 bg-white ' +
  'placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 ' +
  'focus:ring-1 focus:ring-indigo-500 transition-colors'

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
