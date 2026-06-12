import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ favorited: false })
  }

  const fav = await prisma.favorite.findUnique({
    where: {
      userId_episodeId: {
        userId: (session.user as any).id,
        episodeId: id,
      },
    },
  })

  return NextResponse.json({ favorited: !!fav })
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

  await prisma.favorite.create({
    data: {
      userId: (session.user as any).id,
      episodeId: id,
    },
  })

  return NextResponse.json({ favorited: true })
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

  await prisma.favorite.delete({
    where: {
      userId_episodeId: {
        userId: (session.user as any).id,
        episodeId: id,
      },
    },
  })

  return NextResponse.json({ favorited: false })
}
