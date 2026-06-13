import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FavoriteButton } from '@/components/FavoriteButton'
import { CommentSection } from '@/components/CommentSection'
import { Card } from '@/components/Card'

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
    <div className="p-4 max-w-2xl mx-auto">
      <Link href={`/podcasts/${episode.podcast.id}`} className="text-sm text-gray-500 hover:underline">
        ← {episode.podcast.naziv}
      </Link>

      <div className="flex justify-between items-start mt-2">
        <h1 className="text-2xl font-bold">{episode.naslov}</h1>
        <FavoriteButton episodeId={episode.id} />
      </div>

      <Card className="mt-4">
        <p className="text-sm text-gray-500">{Math.round(episode.trajanje / 60)} min</p>
        <p className="mt-2">{episode.opis}</p>
        <audio controls src={episode.audioUrl} className="w-full mt-4" />
      </Card>

      <CommentSection
        episodeId={episode.id}
        initialComments={episode.comments}
      />
    </div>
  )
}
