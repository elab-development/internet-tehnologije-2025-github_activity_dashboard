import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: (session.user as any).id },
    include: {
      podcast: {
        include: { creator: { select: { ime: true } } },
      },
    },
    orderBy: { datumPretplate: 'desc' },
  })

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Moje pretplate</h1>

      <ul className="flex flex-col gap-2">
        {subscriptions.map((s) => (
          <li key={s.id} className="border p-3 rounded">
            <Link href={`/podcasts/${s.podcast.id}`} className="font-semibold hover:underline">
              {s.podcast.naziv}
            </Link>
            <p className="text-sm text-gray-500">by {s.podcast.creator.ime}</p>
          </li>
        ))}
        {subscriptions.length === 0 && <p className="text-sm text-gray-500">Nema pretplata.</p>}
      </ul>
    </div>
  )
}
