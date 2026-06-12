import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const episodes = await prisma.episode.findMany({
    where: { podcastId: id },
    orderBy: { datumObjave: 'desc' },
  })

  return NextResponse.json(episodes)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  const podcast = await prisma.podcast.findUnique({ where: { id } })
  if (!podcast) {
    return NextResponse.json({ error: 'Podcast nije pronađen' }, { status: 404 })
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  if (podcast.creatorId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nemate dozvolu' }, { status: 403 })
  }

  const { naslov, opis, audioUrl, trajanje } = await request.json()

  if (!naslov || !opis || !audioUrl || !trajanje) {
    return NextResponse.json({ error: 'Sva polja su obavezna' }, { status: 400 })
  }

  const episode = await prisma.episode.create({
    data: {
      naslov,
      opis,
      audioUrl,
      trajanje: Number(trajanje),
      podcastId: id,
    },
  })

  return NextResponse.json(episode, { status: 201 })
}
