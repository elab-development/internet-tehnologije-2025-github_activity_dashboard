import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const kategorija = searchParams.get('kategorija')
  const search = searchParams.get('search')

  const podcasts = await prisma.podcast.findMany({
    where: {
      ...(kategorija ? { kategorija: kategorija as any } : {}),
      ...(search
        ? {
            OR: [
              { naziv: { contains: search, mode: 'insensitive' } },
              { opis: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      creator: { select: { id: true, ime: true } },
      _count: { select: { episodes: true, subscriptions: true } },
    },
    orderBy: { datumKreiranja: 'desc' },
  })

  return NextResponse.json(podcasts)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  if ((session.user as any).role !== 'KREATOR') {
    return NextResponse.json(
      { error: 'Samo Podcast Kreatori mogu kreirati podkaste' },
      { status: 403 }
    )
  }

  const { naziv, opis, kategorija } = await request.json()

  if (!naziv || !opis || !kategorija) {
    return NextResponse.json(
      { error: 'Sva polja su obavezna' },
      { status: 400 }
    )
  }

  const podcast = await prisma.podcast.create({
    data: {
      naziv,
      opis,
      kategorija,
      creatorId: (session.user as any).id,
    },
  })

  return NextResponse.json(podcast, { status: 201 })
}
