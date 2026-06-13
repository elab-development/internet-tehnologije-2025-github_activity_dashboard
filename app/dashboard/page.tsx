'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input, Textarea, Select } from '@/components/Input'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

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
      const formData = new FormData()
      formData.append('file', coverFile)
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) {
        setError(uploadData.error || 'Greška prilikom upload-a slike')
        setUploading(false)
        return
      }
      coverImageUrl = uploadData.url
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
    <div className="flex items-center justify-center py-20">
      <p className="text-slate-400">Učitavanje...</p>
    </div>
  )
  if (status === 'unauthenticated') return null

  const role = (session?.user as any)?.role

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      <div className="lg:grid lg:grid-cols-5 lg:gap-8 items-start">
        {role === 'KREATOR' && (
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Novi podcast</h2>
              <form onSubmit={handleCreatePodcast} className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Naziv"
                  value={naziv}
                  onChange={(e) => setNaziv(e.target.value)}
                />
                <Textarea
                  placeholder="Opis"
                  rows={3}
                  value={opis}
                  onChange={(e) => setOpis(e.target.value)}
                />
                <Select value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
                  {KATEGORIJE.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </Select>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Cover slika
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={uploading} className="w-full px-4 py-2.5">
                  {uploading ? 'Upload u toku...' : 'Kreiraj podcast'}
                </Button>
              </form>
            </Card>
          </div>
        )}

        <div className={role === 'KREATOR' ? 'lg:col-span-3' : 'lg:col-span-5'}>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {role === 'ADMIN' ? 'Svi podkasti' : 'Moji podkasti'}
          </h2>

          <div className="flex flex-col gap-4">
            {podcasts.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{p.naziv}</h3>
                    <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide mt-0.5">
                      {p.kategorija}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePodcast(p.id)}
                    className="text-sm px-3 py-1.5"
                  >
                    Obriši
                  </Button>
                </div>

                <EpisodeManager podcastId={p.id} episodes={p.episodes} onChange={fetchMyPodcasts} />
              </Card>
            ))}
            {podcasts.length === 0 && (
              <p className="text-sm text-slate-400 py-8 text-center">Nemate podkaste.</p>
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
    <div>
      {episodes.length > 0 && (
        <ul className="flex flex-col divide-y divide-slate-100 mb-4 border border-slate-100 rounded-lg overflow-hidden">
          {episodes.map((ep) => (
            <li key={ep.id} className="flex justify-between items-center text-sm px-4 py-2.5 bg-slate-50">
              <span className="text-slate-700">
                {ep.naslov}
                <span className="text-slate-400 ml-2">({Math.round(ep.trajanje / 60)} min)</span>
              </span>
              <Button
                variant="danger"
                onClick={() => handleDeleteEpisode(ep.id)}
                className="text-xs px-2.5 py-1"
              >
                Obriši
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="border border-dashed border-slate-200 rounded-lg p-4 bg-slate-50/50">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Nova epizoda
        </p>
        <form onSubmit={handleAddEpisode} className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Naslov epizode"
            value={naslov}
            onChange={(e) => setNaslov(e.target.value)}
            className="text-sm"
          />
          <Input
            type="text"
            placeholder="Opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="text-sm"
          />
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Trajanje (sekunde)"
            value={trajanje}
            onChange={(e) => setTrajanje(e.target.value)}
            className="text-sm"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <Button type="submit" disabled={uploading} className="px-4 py-2 text-sm">
            {uploading ? 'Upload u toku...' : 'Dodaj epizodu'}
          </Button>
        </form>
      </div>
    </div>
  )
}
