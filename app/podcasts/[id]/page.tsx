import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SubscribeButton } from '@/components/SubscribeButton'

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
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-8">
        {podcast.coverImageUrl ? (
          <div className="relative">
            <img
              src={podcast.coverImageUrl}
              alt={podcast.naziv}
              className="w-full aspect-video object-cover"
            />
            {/* Gradient overlay carrying title on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                {podcast.kategorija}
              </span>
              <h1 className="mt-1 text-3xl md:text-4xl font-bold text-white leading-tight">
                {podcast.naziv}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-400">
                by {podcast.creator.ime} · {podcast._count.subscriptions} pretplatnika
              </p>
            </div>
          </div>
        ) : (
          /* No-image fallback: clean dark surface */
          <div className="bg-zinc-900 border border-zinc-800 px-8 py-10">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              {podcast.kategorija}
            </span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-zinc-100 leading-tight">
              {podcast.naziv}
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              by {podcast.creator.ime} · {podcast._count.subscriptions} pretplatnika
            </p>
          </div>
        )}
      </div>

      {/* Description + subscribe CTA */}
      <div className="flex items-start justify-between gap-6 mb-10">
        <p className="text-zinc-400 leading-relaxed max-w-2xl">{podcast.opis}</p>
        <SubscribeButton podcastId={podcast.id} />
      </div>

      {/* Episodes */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">Epizode</h2>
          <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
            {podcast.episodes.length}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {podcast.episodes.map((ep) => (
            <Link
              key={ep.id}
              href={`/episodes/${ep.id}`}
              className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-5 py-4 transition-colors flex items-center justify-between gap-4"
            >
              <span className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                {ep.naslov}
              </span>
              <span className="text-xs text-zinc-500 shrink-0">
                {Math.round(ep.trajanje / 60)} min
              </span>
            </Link>
          ))}

          {podcast.episodes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-600 text-sm">Još nema epizoda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
