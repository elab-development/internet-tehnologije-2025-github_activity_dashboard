'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const KATEGORIJE = ['TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO']

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [naziv, setNaziv] = useState('')
  const [opis, setOpis] = useState('')
  const [kategorija, setKategorija] = useState('OSTALO')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [podcasts, setPodcasts] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchPodcasts()
  }, [])

  async function fetchPodcasts() {
    const res = await fetch('/api/podcasts')
    const data = await res.json()
    setPodcasts(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const res = await fetch('/api/podcasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ naziv, opis, kategorija }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Greška')
      return
    }

    setSuccess('Podcast kreiran!')
    setNaziv('')
    setOpis('')
    fetchPodcasts()
  }

  if (status === 'loading') return <p className="p-4">Učitavanje...</p>
  if (status === 'unauthenticated') return null

  const role = (session?.user as any)?.role

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {role === 'KREATOR' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-4 rounded mb-6">
          <h2 className="font-semibold">Novi podcast</h2>
          <input
            type="text"
            placeholder="Naziv"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={kategorija}
            onChange={(e) => setKategorija(e.target.value)}
            className="border p-2 rounded"
          >
            {KATEGORIJE.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button type="submit" className="bg-black text-white p-2 rounded">
            Kreiraj
          </button>
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </form>
      )}

      <h2 className="font-semibold mb-2">Svi podkasti</h2>
      <ul className="flex flex-col gap-2">
        {podcasts.map((p) => (
          <li key={p.id} className="border p-2 rounded">
            <strong>{p.naziv}</strong> ({p.kategorija}) - by {p.creator.ime}
            <p className="text-sm text-gray-600">{p.opis}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
