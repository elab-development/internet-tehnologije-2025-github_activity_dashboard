import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  if ((session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nemate dozvolu' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      ime: true,
      email: true,
      role: true,
      statusNaloga: true,
      datumRegistracije: true,
    },
    orderBy: { datumRegistracije: 'desc' },
  })

  return NextResponse.json(users)
}
