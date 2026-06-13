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
      variant={subscribed ? 'primary' : 'ghost'}
      onClick={toggle}
      className={`shrink-0 px-4 py-2 text-sm border ${
        subscribed ? 'border-indigo-600' : 'border-slate-300'
      }`}
    >
      {subscribed ? 'Pretplaćen ✓' : 'Pretplati se'}
    </Button>
  )
}
