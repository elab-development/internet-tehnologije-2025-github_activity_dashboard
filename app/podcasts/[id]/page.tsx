import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SubscribeButton } from '@/components/SubscribeButton'
import { Card } from '@/components/Card'

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const podcast = await prisma.podcast.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, ime: true } },
      episodes: { orderBy: { datumObjave: 'desc' } },
      _count: { select: { subscriptions: true } },
    },
  })

  if (!podcast) notFound()

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{podcast.naziv}</h1>
      <p className="text-sm text-gray-500">
        {podcast.kategorija} · by {podcast.creator.ime} · {podcast._count.subscriptions} pretplatnika
      </p>
      <p className="mt-2">{podcast.opis}</p>

      <SubscribeButton podcastId={podcast.id} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Epizode</h2>

      <div className="flex flex-col gap-2">
        {podcast.episodes.map((ep) => (
          <Card key={ep.id}>
            <Link href={`/episodes/${ep.id}`} className="font-semibold hover:underline">
              {ep.naslov}
            </Link>
            <p className="text-xs text-gray-400">{Math.round(ep.trajanje / 60)} min</p>
          </Card>
        ))}
        {podcast.episodes.length === 0 && <p>Još nema epizoda.</p>}
      </div>
    </div>
  )
}