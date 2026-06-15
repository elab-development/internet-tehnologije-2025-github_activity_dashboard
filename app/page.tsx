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
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Hero sekcija sa animated blobs */}
      <div className="relative text-center py-20 px-4 mb-10 overflow-hidden">
        {/* Animated blobs - samo ovde */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-blob"
            style={{ background: 'rgba(99, 102, 241, 0.4)' }}
          />
          <div
            className="absolute top-0 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-blob animation-delay-2000"
            style={{ background: 'rgba(168, 85, 247, 0.4)' }}
          />
          <div
            className="absolute -bottom-10 left-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl animate-blob animation-delay-4000"
            style={{ background: 'rgba(99, 102, 241, 0.3)' }}
          />
        </div>
        {/* Hero sadržaj */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-100 tracking-tight mb-5">
            🎙️ Otkrij nove podkaste
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Prati omiljene autore, komentariši epizode i slušaj gde god da si.
          </p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-8">
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Pretraga po nazimu ili opisu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-44 flex-none">
          <Select
            value={kategorija}
            onChange={(e) => setKategorija(e.target.value)}
          >
            {KATEGORIJE.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Podcast grid — Spotify style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {podcasts.map((p) => (
          <Link href={`/podcasts/${p.id}`} key={p.id}>
            <div className="group cursor-pointer hover:-translate-y-1 transition-all duration-200">
              {/* Cover — square */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800 mb-3">
                {p.coverImageUrl ? (
                  <img
                    src={p.coverImageUrl}
                    alt={p.naziv}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-zinc-800">
                    <span className="text-4xl">🎙️</span>
                  </div>
                )}
                {/* Play button fade in on hover */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm">▶</span>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="px-1">
                <h3 className="font-semibold text-zinc-100 text-base truncate">{p.naziv}</h3>
                <p className="text-xs text-zinc-500 truncate">{p.creator.ime}</p>
                <p className="text-xs text-zinc-600 mt-1">{p._count.episodes} epizoda</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {podcasts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M14.803 9.93a4.5 4.5 0 0 1 0 4.14M6.228 6.228A10.45 10.45 0 0 0 1.5 12c0 4.756 3.155 8.796 7.5 10.02M7.5 3.68A10.45 10.45 0 0 1 12 3c3.82 0 7.19 2.052 9 5.147" />
          </svg>
          <p className="text-zinc-500">Nema rezultata za zadatu pretragu.</p>
        </div>
      )}
    </div>
  )
}
