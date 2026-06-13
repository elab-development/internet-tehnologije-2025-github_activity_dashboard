'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/Button'

export function SubscribeButton({ podcastId }: { podcastId: string }) {
  const { status } = useSession()
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/podcasts/${podcastId}/subscribe`)
      .then((r) => r.json())
      .then((data) => {
        setSubscribed(data.subscribed)
        setLoading(false)
      })
  }, [podcastId])

  if (status !== 'authenticated') return null
  if (loading) return null

  async function toggle() {
    const res = await fetch(`/api/podcasts/${podcastId}/subscribe`, {
      method: subscribed ? 'DELETE' : 'POST',
      credentials: 'include',
    })
    const data = await res.json()
    setSubscribed(data.subscribed)
  }

  return (
    <Button
      variant="ghost"
      onClick={toggle}
      className={`mt-2 px-3 py-1 rounded border ${subscribed ? 'bg-black text-white' : ''}`}
    >
      {subscribed ? 'Pretplaćen ✓' : 'Pretplati se'}
    </Button>
  )
}
