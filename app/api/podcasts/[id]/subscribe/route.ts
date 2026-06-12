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
    return NextResponse.json({ subscribed: false })
  }

  const sub = await prisma.subscription.findUnique({
    where: {
      userId_podcastId: {
        userId: (session.user as any).id,
        podcastId: id,
      },
    },
  })

  return NextResponse.json({ subscribed: !!sub })
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

  await prisma.subscription.create({
    data: {
      userId: (session.user as any).id,
      podcastId: id,
    },
  })

  return NextResponse.json({ subscribed: true })
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

  await prisma.subscription.delete({
    where: {
      userId_podcastId: {
        userId: (session.user as any).id,
        podcastId: id,
      },
    },
  })

  return NextResponse.json({ subscribed: false })
}
