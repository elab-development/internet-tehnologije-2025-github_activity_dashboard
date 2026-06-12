'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const KATEGORIJE = ['SVE', 'TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO']

export default function HomePage() {
  const [podcasts, setPodcasts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [kategorija, setKategorija] = useState('SVE')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (kategorija !== 'SVE') params.set('kategorija', kategorija)

    const timeout = setTimeout(() => {
      fetch(`/api/podcasts?${params.toString()}`)
        .then((r) => r.json())
        .then(setPodcasts)
    }, 300) // debounce za search

    return () => clearTimeout(timeout)
  }, [search, kategorija])

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Podkasti</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Pretraga..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
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
      </div>

      <ul className="flex flex-col gap-2">
        {podcasts.map((p) => (
          <li key={p.id} className="border p-3 rounded">
            <Link href={`/podcasts/${p.id}`} className="font-semibold text-lg hover:underline">
              {p.naziv}
            </Link>
            <p className="text-sm text-gray-500">{p.kategorija} - by {p.creator.ime}</p>
            <p className="text-sm">{p.opis}</p>
            <p className="text-xs text-gray-400">
              {p._count.episodes} epizoda · {p._count.subscriptions} pretplatnika
            </p>
          </li>
        ))}
        {podcasts.length === 0 && <p>Nema rezultata.</p>}
      </ul>
    </div>
  )
}