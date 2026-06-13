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
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Komentari
        {comments.length > 0 && (
          <span className="ml-2 text-sm font-normal text-slate-400">({comments.length})</span>
        )}
      </h2>

      {status === 'authenticated' && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Napiši komentar..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="px-4 py-2 shrink-0">
            Pošalji
          </Button>
        </form>
      )}
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="flex flex-col gap-2">
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-3"
          >
            <p className="text-sm font-semibold text-slate-700">{c.user.ime}</p>
            <p className="text-slate-600 mt-0.5">{c.sadrzaj}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 py-4 text-center">Još nema komentara.</p>
        )}
      </div>
    </div>
  )
}
