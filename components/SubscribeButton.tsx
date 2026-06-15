'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

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
    <button
      onClick={toggle}
      className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
        subscribed
          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:border-emerald-700'
          : 'bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-zinc-100'
      }`}
    >
      {subscribed ? (
        <>
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Pretplaćen
        </>
      ) : (
        'Pretplati se'
      )}
    </button>
  )
}
