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
  const [podcasts, setPodcasts] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session?.user) fetchMyPodcasts()
  }, [session])

  async function fetchMyPodcasts() {
    const res = await fetch('/api/podcasts')
    const all = await res.json()
    const userId = (session?.user as any).id
    const role = (session?.user as any).role

    const mine = role === 'ADMIN' ? all : all.filter((p: any) => p.creatorId === userId)

    const withEpisodes = await Promise.all(
      mine.map(async (p: any) => {
        const r = await fetch(`/api/podcasts/${p.id}/episodes`)
        const episodes = await r.json()
        return { ...p, episodes }
      })
    )

    setPodcasts(withEpisodes)
  }

  async function handleCreatePodcast(e: React.FormEvent) {
    e.preventDefault()
    setError('')

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

    setNaziv('')
    setOpis('')
    fetchMyPodcasts()
  }

  async function handleDeletePodcast(id: string) {
    if (!confirm('Obrisati podcast i sve njegove epizode?')) return
    const res = await fetch(`/api/podcasts/${id}`, { method: 'DELETE', credentials: 'include' })
    if (!res.ok) {
      const data = await res.json()
      alert(data.error || 'Greška prilikom brisanja')
      return
    }
    fetchMyPodcasts()
  }

  if (status === 'loading') return <p className="p-4">Učitavanje...</p>
  if (status === 'unauthenticated') return null

  const role = (session?.user as any)?.role

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {role === 'KREATOR' && (
        <form onSubmit={handleCreatePodcast} className="flex flex-col gap-3 border p-4 rounded mb-6">
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
        </form>
      )}

      <h2 className="font-semibold mb-2">{role === 'ADMIN' ? 'Svi podkasti' : 'Moji podkasti'}</h2>

      <div className="flex flex-col gap-4">
        {podcasts.map((p) => (
          <div key={p.id} className="border p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{p.naziv}</h3>
                <p className="text-sm text-gray-500">{p.kategorija}</p>
              </div>
              <button
                onClick={() => handleDeletePodcast(p.id)}
                className="text-red-600 text-sm"
              >
                Obriši podcast
              </button>
            </div>

            <EpisodeManager podcastId={p.id} episodes={p.episodes} onChange={fetchMyPodcasts} />
          </div>
        ))}
        {podcasts.length === 0 && <p className="text-sm text-gray-500">Nemate podkaste.</p>}
      </div>
    </div>
  )
}

function EpisodeManager({
  podcastId,
  episodes,
  onChange,
}: {
  podcastId: string
  episodes: any[]
  onChange: () => void
}) {
  const [naslov, setNaslov] = useState('')
  const [opis, setOpis] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [trajanje, setTrajanje] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  async function handleAddEpisode(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!audioFile) {
      setError('Izaberite audio fajl')
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('file', audioFile)

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const uploadData = await uploadRes.json()

    if (!uploadRes.ok) {
      setError(uploadData.error || 'Greška prilikom upload-a')
      setUploading(false)
      return
    }

    const res = await fetch(`/api/podcasts/${podcastId}/episodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        naslov,
        opis,
        audioUrl: uploadData.url,
        trajanje: Number(trajanje),
      }),
    })

    const data = await res.json()
    setUploading(false)

    if (!res.ok) {
      setError(data.error || 'Greška')
      return
    }

    setNaslov('')
    setOpis('')
    setAudioFile(null)
    setTrajanje('')
    onChange()
  }

  async function handleDeleteEpisode(id: string) {
    if (!confirm('Obrisati epizodu?')) return
    await fetch(`/api/episodes/${id}`, { method: 'DELETE', credentials: 'include' })
    onChange()
  }

  return (
    <div className="mt-3">
      <ul className="flex flex-col gap-1 mb-2">
        {episodes.map((ep) => (
          <li key={ep.id} className="flex justify-between text-sm border-b py-1">
            <span>{ep.naslov} ({Math.round(ep.trajanje / 60)} min)</span>
            <button onClick={() => handleDeleteEpisode(ep.id)} className="text-red-600">
              Obriši
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddEpisode} className="flex flex-col gap-2 bg-gray-50 p-2 rounded">
        <input
          type="text"
          placeholder="Naslov epizode"
          value={naslov}
          onChange={(e) => setNaslov(e.target.value)}
          className="border p-1 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Opis"
          value={opis}
          onChange={(e) => setOpis(e.target.value)}
          className="border p-1 rounded text-sm"
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          className="border p-1 rounded text-sm"
        />
        <input
          type="number"
          placeholder="Trajanje (sekunde)"
          value={trajanje}
          onChange={(e) => setTrajanje(e.target.value)}
          className="border p-1 rounded text-sm"
        />
        <button type="submit" disabled={uploading} className="bg-black text-white p-1 rounded text-sm disabled:opacity-50">
          {uploading ? 'Upload u toku...' : 'Dodaj epizodu'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}