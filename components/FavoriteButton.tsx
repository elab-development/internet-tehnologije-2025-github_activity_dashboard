'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function FavoriteButton({ episodeId }: { episodeId: string }) {
  const { status } = useSession()
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/episodes/${episodeId}/favorite`)
      .then((r) => r.json())
      .then((data) => {
        setFavorited(data.favorited)
        setLoading(false)
      })
  }, [episodeId])

  if (status !== 'authenticated') return null
  if (loading) return null

  async function toggle() {
    const res = await fetch(`/api/episodes/${episodeId}/favorite`, {
      method: favorited ? 'DELETE' : 'POST',
      credentials: 'include',
    })
    const data = await res.json()
    setFavorited(data.favorited)
  }

  return (
    <button
      onClick={toggle}
      aria-label={favorited ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
      className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${
        favorited
          ? 'text-amber-400 border-amber-900/60 bg-amber-950/30 hover:bg-amber-950/50'
          : 'text-zinc-600 border-zinc-700 hover:text-amber-400 hover:border-amber-900/60 hover:bg-amber-950/20'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </button>
  )
}
