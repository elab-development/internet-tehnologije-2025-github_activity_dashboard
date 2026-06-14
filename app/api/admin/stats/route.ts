import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nemate dozvolu' }, { status: 403 })
  }

  const podcastsByCategory = await prisma.podcast.groupBy({
    by: ['kategorija'],
    _count: { id: true },
  })

  const topPodcasts = await prisma.podcast.findMany({
    select: {
      naziv: true,
      _count: { select: { subscriptions: true } },
    },
    orderBy: { subscriptions: { _count: 'desc' } },
    take: 5,
  })

  const [totalUsers, totalPodcasts, totalEpisodes, totalComments] = await Promise.all([
    prisma.user.count(),
    prisma.podcast.count(),
    prisma.episode.count(),
    prisma.comment.count(),
  ])

  return NextResponse.json({
    podcastsByCategory: podcastsByCategory.map(p => ({
      kategorija: p.kategorija,
      broj: p._count.id,
    })),
    topPodcasts: topPodcasts.map(p => ({
      naziv: p.naziv,
      pretplatnici: p._count.subscriptions,
    })),
    totals: { totalUsers, totalPodcasts, totalEpisodes, totalComments },
  })
}
