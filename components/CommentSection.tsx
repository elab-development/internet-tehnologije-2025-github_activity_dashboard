'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type Comment = {
  id: string
  sadrzaj: string
  datumKreiranja: string
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
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Komentari</h2>

      {status === 'authenticated' && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Napiši komentar..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button type="submit" className="bg-black text-white px-3 py-1 rounded">
            Pošalji
          </button>
        </form>
      )}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="flex flex-col gap-2">
        {comments.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <p className="text-sm font-semibold">{c.user.ime}</p>
            <p>{c.sadrzaj}</p>
          </li>
        ))}
        {comments.length === 0 && <p className="text-sm text-gray-500">Još nema komentara.</p>}
      </ul>
    </div>
  )
}
