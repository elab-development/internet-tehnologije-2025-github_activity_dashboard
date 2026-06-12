import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  const { sadrzaj } = await request.json()

  if (!sadrzaj || !sadrzaj.trim()) {
    return NextResponse.json({ error: 'Komentar ne može biti prazan' }, { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      sadrzaj,
      userId: (session.user as any).id,
      episodeId: id,
    },
    include: {
      user: { select: { id: true, ime: true } },
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
