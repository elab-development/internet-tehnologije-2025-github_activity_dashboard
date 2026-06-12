import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const podcast = await prisma.podcast.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, ime: true } },
      episodes: { orderBy: { datumObjave: 'desc' } },
      _count: { select: { subscriptions: true } },
    },
  })

  if (!podcast) {
    return NextResponse.json({ error: 'Podcast nije pronađen' }, { status: 404 })
  }

  return NextResponse.json(podcast)
}

export async function PUT(
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

  const { naziv, opis, kategorija } = await request.json()

  const updated = await prisma.podcast.update({
    where: { id },
    data: {
      ...(naziv && { naziv }),
      ...(opis && { opis }),
      ...(kategorija && { kategorija }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
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

  await prisma.podcast.delete({ where: { id } })

  return NextResponse.json({ message: 'Podcast obrisan' })
}
