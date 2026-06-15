import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const episode = await prisma.episode.findUnique({
    where: { id },
    include: {
      podcast: { select: { id: true, naziv: true, creatorId: true } },
      comments: {
        include: { user: { select: { id: true, ime: true } } },
        orderBy: { datumKreiranja: 'desc' },
      },
    },
  })

  if (!episode) {
    return NextResponse.json({ error: 'Epizoda nije pronađena' }, { status: 404 })
  }

  return NextResponse.json(episode)
}

async function checkPermission(episodeId: string, session: any) {
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: { podcast: true },
  })

  if (!episode) return { error: 'Epizoda nije pronađena', status: 404 }

  const userId = session?.user ? (session.user as any).id : null
  const role = session?.user ? (session.user as any).role : null

  if (!session?.user) return { error: 'Niste ulogovani', status: 401 }

  if (episode.podcast.creatorId !== userId && role !== 'ADMIN') {
    return { error: 'Nemate dozvolu', status: 403 }
  }

  return { episode }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  const check = await checkPermission(id, session)
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  const { naslov, opis, audioUrl, trajanje } = await request.json()

  const updated = await prisma.episode.update({
    where: { id },
    data: {
      ...(naslov && { naslov }),
      ...(opis && { opis }),
      ...(audioUrl && { audioUrl }),
      ...(trajanje && { trajanje: Number(trajanje) }),
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

  const check = await checkPermission(id, session)
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  await deleteFromS3(check.episode.audioUrl)

  await prisma.episode.delete({ where: { id } })

  return NextResponse.json({ message: 'Epizoda obrisana' })
}
