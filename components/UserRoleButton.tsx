'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'

export function UserRoleButton({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: string
}) {
  const router = useRouter()

  async function changeRole(novaRole: string) {
    await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role: novaRole }),
    })
    router.refresh()
  }

  if (currentRole === 'ADMIN') return null

  if (currentRole === 'SLUSALAC') {
    return (
      <Button variant="primary" className="text-xs px-3 py-1.5" onClick={() => changeRole('KREATOR')}>
        Promoviši u Kreatora
      </Button>
    )
  }

  return (
    <Button variant="ghost" className="text-xs px-3 py-1.5" onClick={() => changeRole('SLUSALAC')}>
      Vrati na Slušaoca
    </Button>
  )
}
