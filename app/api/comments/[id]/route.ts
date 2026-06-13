import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment) {
    return NextResponse.json({ error: 'Komentar nije pronađen' }, { status: 404 })
  }

  const userId = (session.user as any).id
  const role = (session.user as any).role

  if (comment.userId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nemate dozvolu' }, { status: 403 })
  }

  await prisma.comment.delete({ where: { id } })

  return NextResponse.json({ message: 'Komentar obrisan' })
}
