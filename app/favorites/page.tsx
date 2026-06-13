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
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Omiljene epizode</h1>
        <p className="mt-1.5 text-zinc-400">
          {favorites.length > 0
            ? `${favorites.length} sačuvanih epizoda`
            : 'Još niste sačuvali epizode'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {favorites.map((f) => (
          <Link
            key={f.id}
            href={`/episodes/${f.episode.id}`}
            className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-5 py-4 transition-colors"
          >
            <p className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
              {f.episode.naslov}
            </p>
            <p className="text-sm text-zinc-500 mt-0.5">{f.episode.podcast.naziv}</p>
          </Link>
        ))}

        {favorites.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            <p className="text-zinc-600 text-sm">
              Označite epizode zvezdicom da se pojave ovde.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
