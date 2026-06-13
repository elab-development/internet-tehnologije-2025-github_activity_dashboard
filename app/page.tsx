'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input, Select } from '@/components/Input'

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
    }, 300)

    return () => clearTimeout(timeout)
  }, [search, kategorija])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Podkasti</h1>

      <div className="flex gap-3 mb-6">
        <Input
          type="text"
          placeholder="Pretraga..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          value={kategorija}
          onChange={(e) => setKategorija(e.target.value)}
          className="w-44"
        >
          {KATEGORIJE.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map((p) => (
          <Link
            key={p.id}
            href={`/podcasts/${p.id}`}
            className="group bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-xl overflow-hidden transition-shadow"
          >
            {p.coverImageUrl ? (
              <img
                src={p.coverImageUrl}
                alt={p.naziv}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
            <div className="p-4">
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                {p.kategorija}
              </span>
              <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5 leading-snug">
                {p.naziv}
              </h2>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.opis}</p>
              <p className="text-xs text-slate-400 mt-2">
                by {p.creator.ime} · {p._count.episodes} ep · {p._count.subscriptions} pretpl.
              </p>
            </div>
          </Link>
        ))}
      </div>

      {podcasts.length === 0 && (
        <p className="text-center text-slate-400 py-16">Nema rezultata.</p>
      )}
    </div>
  )
}
