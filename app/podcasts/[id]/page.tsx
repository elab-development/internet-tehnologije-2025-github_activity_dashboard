import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SubscribeButton } from '@/components/SubscribeButton'
import { FavoriteButton } from '@/components/FavoriteButton'

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

      <ul className="flex flex-col gap-3">
        {podcast.episodes.map((ep) => (
          <li key={ep.id} className="border p-3 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{ep.naslov}</h3>
                <p className="text-sm text-gray-600">{ep.opis}</p>
                <p className="text-xs text-gray-400">{Math.round(ep.trajanje / 60)} min</p>
              </div>
              <FavoriteButton episodeId={ep.id} />
            </div>
            <audio controls src={ep.audioUrl} className="w-full mt-2" />
          </li>
        ))}
        {podcast.episodes.length === 0 && <p>Još nema epizoda.</p>}
      </ul>
    </div>
  )
}
