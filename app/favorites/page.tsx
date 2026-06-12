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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Omiljene epizode</h1>

      <ul className="flex flex-col gap-2">
        {favorites.map((f) => (
          <li key={f.id} className="border p-3 rounded">
            <Link href={`/episodes/${f.episode.id}`} className="font-semibold hover:underline">
              {f.episode.naslov}
            </Link>
            <p className="text-sm text-gray-500">{f.episode.podcast.naziv}</p>
          </li>
        ))}
        {favorites.length === 0 && <p className="text-sm text-gray-500">Nema omiljenih epizoda.</p>}
      </ul>
    </div>
  )
}
