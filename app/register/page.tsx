'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-bold">Registracija</h1>

      <input
        type="text"
        placeholder="Ime i prezime"
        value={ime}
        onChange={(e) => setIme(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      <label className="flex flex-col gap-1">
        Tip korisnika
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="SLUSALAC">Slušalac</option>
          <option value="KREATOR">Podcast Kreator</option>
        </select>
      </label>

      <button type="submit" className="bg-black text-white p-2 rounded">
        Registruj se
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </form>
  )
}
