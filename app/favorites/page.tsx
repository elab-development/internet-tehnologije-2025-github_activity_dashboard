import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const favorites = await prisma.favorite.findMany({
    where: { userId: (session.user as any).id },
    include: {
      episode: {
        include: { podcast: { select: { id: true, naziv: true } } },
      },
    },
    orderBy: { datumDodavanja: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Omiljene epizode</h1>

      <div className="flex flex-col gap-3">
        {favorites.map((f) => (
          <Link
            key={f.id}
            href={`/episodes/${f.episode.id}`}
            className="group bg-white border border-slate-100 shadow-sm hover:shadow-md rounded-xl px-5 py-4 transition-shadow"
          >
            <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
              {f.episode.naslov}
            </p>
            <p className="text-sm text-slate-400 mt-0.5">{f.episode.podcast.naziv}</p>
          </Link>
        ))}
        {favorites.length === 0 && (
          <p className="text-center text-slate-400 py-16">Nema omiljenih epizoda.</p>
        )}
      </div>
    </div>
  )
}
