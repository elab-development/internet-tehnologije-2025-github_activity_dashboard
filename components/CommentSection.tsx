'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

type Comment = {
  id: string
  sadrzaj: string
  datumKreiranja: Date | string
  user: { id: string; ime: string }
}

export function CommentSection({
  episodeId,
  initialComments,
}: {
  episodeId: string
  initialComments: Comment[]
}) {
  const { status } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch(`/api/episodes/${episodeId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sadrzaj: text }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Greška')
      return
    }

    setComments([data, ...comments])
    setText('')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold text-zinc-100">Komentari</h2>
        {comments.length > 0 && (
          <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </div>

      {status === 'authenticated' && (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <Input
            type="text"
            placeholder="Napiši komentar..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="px-4 py-2.5 shrink-0">
            Pošalji
          </Button>
        </form>
      )}
      {error && (
        <p className="text-sm text-red-400 mb-4">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4">
            <p className="text-sm font-medium text-zinc-300 mb-1">{c.user.ime}</p>
            <p className="text-zinc-400 text-sm leading-relaxed">{c.sadrzaj}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-zinc-600 text-sm">Još nema komentara. Budite prvi!</p>
          </div>
        )}
      </div>
    </div>
  )
}
