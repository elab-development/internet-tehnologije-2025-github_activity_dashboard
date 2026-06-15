'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/Button'

type StatusNaloga = 'AKTIVAN' | 'SUSPENDOVAN' | 'OBRISAN'

export function UserStatusButton({
  userId,
  statusNaloga,
}: {
  userId: string
  statusNaloga: StatusNaloga
}) {
  const router = useRouter()
  const { data: session } = useSession()

  const isOwnAccount = (session?.user as any)?.id === userId

  async function toggle() {
    const noviStatus = statusNaloga === 'AKTIVAN' ? 'SUSPENDOVAN' : 'AKTIVAN'
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ statusNaloga: noviStatus }),
    })
    router.refresh()
  }

  if (statusNaloga === 'AKTIVAN') {
    if (isOwnAccount) {
      return <span className="text-xs text-zinc-600 px-3 py-1.5">(vaš nalog)</span>
    }
    return (
      <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors" onClick={toggle}>
        Suspenduj
      </button>
    )
  }

  return (
    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors" onClick={toggle}>
      Aktiviraj
    </button>
  )
}
