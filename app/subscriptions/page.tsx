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
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Moje pretplate</h1>
        <p className="mt-1.5 text-zinc-400">
          {subscriptions.length > 0
            ? `Pratite ${subscriptions.length} podcast${subscriptions.length > 1 ? 'a' : ''}`
            : 'Još niste pretplaćeni ni na jedan podcast'}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {subscriptions.map((s) => (
          <Link
            key={s.id}
            href={`/podcasts/${s.podcast.id}`}
            className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl px-5 py-4 transition-colors flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                {s.podcast.naziv}
              </p>
              <p className="text-sm text-zinc-500 mt-0.5">by {s.podcast.creator.ime}</p>
            </div>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}

        {subscriptions.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M14.803 9.93a4.5 4.5 0 0 1 0 4.14M6.228 6.228A10.45 10.45 0 0 0 1.5 12c0 4.756 3.155 8.796 7.5 10.02M7.5 3.68A10.45 10.45 0 0 1 12 3c3.82 0 7.19 2.052 9 5.147" />
            </svg>
            <p className="text-zinc-600 text-sm">
              Pretplatite se na podkast da ga pratite ovde.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
