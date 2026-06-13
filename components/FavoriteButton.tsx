'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/Button'

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
    <Button variant="ghost" onClick={toggle} className="text-xl">
      {favorited ? '★' : '☆'}
    </Button>
  )
}
