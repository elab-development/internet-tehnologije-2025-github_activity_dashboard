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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        {podcast.coverImageUrl ? (
          <>
            <img
              src={podcast.coverImageUrl}
              alt={podcast.naziv}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
                {podcast.kategorija}
              </span>
              <h1 className="text-3xl font-bold text-white mt-1 leading-tight">{podcast.naziv}</h1>
              <p className="text-sm text-white/70 mt-1">
                by {podcast.creator.ime} · {podcast._count.subscriptions} pretplatnika
              </p>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-indigo-50 to-violet-100 p-8">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
              {podcast.kategorija}
            </span>
            <h1 className="text-3xl font-bold text-slate-900 mt-1 leading-tight">{podcast.naziv}</h1>
            <p className="text-sm text-slate-500 mt-1">
              by {podcast.creator.ime} · {podcast._count.subscriptions} pretplatnika
            </p>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-4 mb-8">
        <p className="text-slate-600 leading-relaxed">{podcast.opis}</p>
        <SubscribeButton podcastId={podcast.id} />
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mb-3">
        Epizode
        <span className="ml-2 text-sm font-normal text-slate-400">
          ({podcast.episodes.length})
        </span>
      </h2>

      <div className="flex flex-col gap-2">
        {podcast.episodes.map((ep) => (
          <Link
            key={ep.id}
            href={`/episodes/${ep.id}`}
            className="group bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-xl px-5 py-4 transition-shadow flex items-center justify-between"
          >
            <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
              {ep.naslov}
            </span>
            <span className="text-xs text-slate-400 shrink-0 ml-4">
              {Math.round(ep.trajanje / 60)} min
            </span>
          </Link>
        ))}
        {podcast.episodes.length === 0 && (
          <p className="text-slate-400 py-8 text-center">Još nema epizoda.</p>
        )}
      </div>
    </div>
  )
}
