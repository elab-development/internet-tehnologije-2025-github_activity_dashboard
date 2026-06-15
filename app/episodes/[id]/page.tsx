import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FavoriteButton } from '@/components/FavoriteButton'
import { CommentSection } from '@/components/CommentSection'
import { PodcastAudioPlayer } from '@/components/AudioPlayer'

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
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href={`/podcasts/${episode.podcast.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {episode.podcast.naziv}
      </Link>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 leading-tight">{episode.naslov}</h1>
        <FavoriteButton episodeId={episode.id} />
      </div>

      {/* Metadata */}
      <p className="text-sm text-zinc-500 mb-8">
        {Math.round(episode.trajanje / 60)} min
      </p>

      {/* Player card */}
      <div className="mb-10">
        {episode.opis && (
          <p className="text-base text-zinc-400 leading-relaxed mb-4">{episode.opis}</p>
        )}
        <PodcastAudioPlayer src={episode.audioUrl} title={episode.naslov} />
      </div>

      {/* Comments */}
      <CommentSection episodeId={episode.id} initialComments={episode.comments} />
    </div>
  )
}
