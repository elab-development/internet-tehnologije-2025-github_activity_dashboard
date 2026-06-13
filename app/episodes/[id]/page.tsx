import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FavoriteButton } from '@/components/FavoriteButton'
import { CommentSection } from '@/components/CommentSection'

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const episode = await prisma.episode.findUnique({
    where: { id },
    include: {
      podcast: { select: { id: true, naziv: true } },
      comments: {
        include: { user: { select: { id: true, ime: true } } },
        orderBy: { datumKreiranja: 'desc' },
      },
    },
  })

  if (!episode) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href={`/podcasts/${episode.podcast.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-indigo-600 transition-colors mb-6"
      >
        ← {episode.podcast.naziv}
      </Link>

      <div className="flex items-start justify-between gap-4 mb-1">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{episode.naslov}</h1>
        <FavoriteButton episodeId={episode.id} />
      </div>
      <p className="text-xs text-slate-400 mb-6">{Math.round(episode.trajanje / 60)} min</p>

      <div className="bg-white border border-slate-100 shadow-sm rounded-xl p-6 mb-8">
        {episode.opis && (
          <p className="text-slate-600 leading-relaxed mb-5">{episode.opis}</p>
        )}
        <audio controls src={episode.audioUrl} className="w-full rounded-lg" />
      </div>

      <CommentSection episodeId={episode.id} initialComments={episode.comments} />
    </div>
  )
}
