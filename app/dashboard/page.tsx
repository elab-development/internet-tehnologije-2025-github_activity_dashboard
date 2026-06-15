'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input, Textarea, Select } from '@/components/Input'
import { Button } from '@/components/Button'
import { uploadFile } from '@/lib/upload'

const KATEGORIJE = ['TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO']

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [naziv, setNaziv] = useState('')
  const [opis, setOpis] = useState('')
  const [kategorija, setKategorija] = useState('OSTALO')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
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
    setUploading(true)

    let coverImageUrl: string | null = null

    if (coverFile) {
      try {
        coverImageUrl = await uploadFile(coverFile)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Greška pri upload-u slike')
        setUploading(false)
        return
      }
    }

    const res = await fetch('/api/podcasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ naziv, opis, kategorija, coverImageUrl }),
    })

    const data = await res.json()
    setUploading(false)
    if (!res.ok) {
      setError(data.error || 'Greška')
      return
    }

    setNaziv('')
    setOpis('')
    setCoverFile(null)
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

  if (status === 'loading') return (
    <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
      <p className="text-zinc-500">Učitavanje...</p>
    </div>
  )
  if (status === 'unauthenticated') return null

  const role = (session?.user as any)?.role

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-zinc-400">
          {role === 'ADMIN' ? 'Upravljanje svim podkastima' : 'Upravljanje vašim podkastima i epizodama'}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-8 items-start">
        {/* Create form — only for KREATOR */}
        {role === 'KREATOR' && (
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🎙️</span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-zinc-100">Novi podcast</h2>
                  <p className="text-xs text-zinc-500">Kreiraj novi podcast i dodaj epizode</p>
                </div>
              </div>
              <form onSubmit={handleCreatePodcast} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Naziv</label>
                  <Input
                    type="text"
                    placeholder="Naziv podcasta"
                    value={naziv}
                    onChange={(e) => setNaziv(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Opis</label>
                  <Textarea
                    placeholder="Kratki opis..."
                    rows={3}
                    value={opis}
                    onChange={(e) => setOpis(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Kategorija</label>
                  <Select value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
                    {KATEGORIJE.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Cover slika</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={uploading} className="w-full px-4 py-2.5 mt-1">
                  {uploading ? 'Upload u toku...' : 'Kreiraj podcast'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Podcast list */}
        <div className={role === 'KREATOR' ? 'lg:col-span-3' : 'lg:col-span-5'}>
          <h2 className="text-base font-semibold text-zinc-100 mb-4">
            {role === 'ADMIN' ? 'Svi podkasti' : 'Moji podkasti'}
          </h2>

          <div className="flex flex-col gap-4">
            {podcasts.map((p) => (
              <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-zinc-100">{p.naziv}</h3>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                      {p.kategorija}
                    </span>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePodcast(p.id)}
                    className="text-sm px-3 py-1.5"
                  >
                    Obriši podcast
                  </Button>
                </div>

                <EpisodeManager
                  podcastId={p.id}
                  episodes={p.episodes}
                  onChange={fetchMyPodcasts}
                  isOwner={p.creatorId === (session?.user as any)?.id}
                />
              </div>
            ))}

            {podcasts.length === 0 && (
              <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
                <p className="text-zinc-500 text-sm">Nemate podkaste.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EpisodeManager({
  podcastId,
  episodes,
  onChange,
  isOwner,
}: {
  podcastId: string
  episodes: any[]
  onChange: () => void
  isOwner: boolean
}) {
  const [naslov, setNaslov] = useState('')
  const [opis, setOpis] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioDuration, setAudioDuration] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  function getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio()
      audio.src = URL.createObjectURL(file)
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration))
        URL.revokeObjectURL(audio.src)
      })
    })
  }

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  async function handleAddEpisode(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!audioFile) {
      setError('Izaberite audio fajl')
      return
    }

    setUploading(true)

    let audioUrl: string
    try {
      audioUrl = await uploadFile(audioFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri upload-u audio fajla')
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
        audioUrl,
        trajanje: audioDuration ?? 0,
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
    setAudioDuration(null)
    onChange()
  }

  async function handleDeleteEpisode(id: string) {
    if (!confirm('Obrisati epizodu?')) return
    await fetch(`/api/episodes/${id}`, { method: 'DELETE', credentials: 'include' })
    onChange()
  }

  return (
    <div>
      {/* Episode list */}
      {episodes.length > 0 && (
        <ul className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden mb-4">
          {episodes.map((ep) => (
            <li key={ep.id} className="flex justify-between items-center px-4 py-3 bg-zinc-800/30">
              <span className="text-sm text-zinc-300">
                {ep.naslov}
                <span className="text-zinc-600 ml-2">({Math.round(ep.trajanje / 60)} min)</span>
              </span>
              <Button
                variant="danger"
                onClick={() => handleDeleteEpisode(ep.id)}
                className="text-xs px-2.5 py-1.5 ml-3"
              >
                Obriši
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Add episode form — only for podcast owner */}
      {isOwner && <div className="border border-dashed border-zinc-700 rounded-lg p-4">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          Dodaj epizodu
        </p>
        <form onSubmit={handleAddEpisode} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Naslov epizode"
            value={naslov}
            onChange={(e) => setNaslov(e.target.value)}
            className="text-sm"
          />
          <Input
            type="text"
            placeholder="Opis epizode"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="text-sm"
          />
          <div className="flex flex-col gap-1">
            <Input
              type="file"
              accept="audio/*"
              onChange={async (e) => {
                const f = e.target.files?.[0] || null
                setAudioFile(f)
                setAudioDuration(f ? await getAudioDuration(f) : null)
              }}
              className="text-sm"
            />
            {audioDuration !== null && (
              <p className="text-xs text-zinc-400">Trajanje: {formatDuration(audioDuration)}</p>
            )}
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" disabled={uploading} className="px-4 py-2 text-sm">
            {uploading ? 'Upload u toku...' : 'Dodaj epizodu'}
          </Button>
        </form>
      </div>}
    </div>
  )
}
