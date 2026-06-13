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
  const { data: session, status } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const currentUserId = (session?.user as any)?.id
  const currentRole = (session?.user as any)?.role

  async function handleDelete(commentId: string) {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    }
  }

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
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-300 mb-1">{c.user.ime}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{c.sadrzaj}</p>
              </div>
              {(currentUserId === c.user.id || currentRole === 'ADMIN') && (
                <Button
                  variant="danger"
                  className="shrink-0 text-xs px-2 py-1"
                  onClick={() => handleDelete(c.id)}
                >
                  Obriši
                </Button>
              )}
            </div>
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
