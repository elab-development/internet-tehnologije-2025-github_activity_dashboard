'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input, Select } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function RegisterPage() {
  const [ime, setIme] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('SLUSALAC')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ime, email, password, role }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Greška prilikom registracije')
      return
    }

    const signInRes = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (signInRes?.error) {
      setError('Registracija uspešna, ali login nije uspeo')
      return
    }

    router.push('/')
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Registracija</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Ime i prezime</label>
            <Input
              type="text"
              placeholder="Vaše ime"
              value={ime}
              onChange={(e) => setIme(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              placeholder="email@primer.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Lozinka</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Tip korisnika</label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="SLUSALAC">Slušalac</option>
              <option value="KREATOR">Podcast Kreator</option>
            </Select>
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full px-4 py-2.5 mt-1">
            Registruj se
          </Button>
          <p className="text-sm text-center text-slate-500">
            Već imate nalog?{' '}
            <Link href="/login" className="text-indigo-600 hover:underline font-medium">
              Prijavite se
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
