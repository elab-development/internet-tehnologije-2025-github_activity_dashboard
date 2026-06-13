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
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Podkasti</h1>
        <p className="mt-1.5 text-zinc-400">Otkrijte i pretplatite se na omiljene podkaste</p>
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

      {/* Podcast grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map((p) => (
          <Link
            key={p.id}
            href={`/podcasts/${p.id}`}
            className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-colors"
          >
            {/* Cover */}
            {p.coverImageUrl ? (
              <img
                src={p.coverImageUrl}
                alt={p.naziv}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-zinc-800 flex items-center justify-center">
                <svg className="w-10 h-10 text-zinc-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                {p.kategorija}
              </span>
              <h2 className="mt-1.5 font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors leading-snug">
                {p.naziv}
              </h2>
              <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">{p.opis}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                <span className="truncate">{p.creator.ime}</span>
                <span className="shrink-0 ml-3">
                  {p._count.episodes} ep · {p._count.subscriptions} pretpl.
                </span>
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
