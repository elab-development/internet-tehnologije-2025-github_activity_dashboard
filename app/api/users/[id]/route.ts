import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'Niste ulogovani' }, { status: 401 })
  }

  if ((session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nemate dozvolu' }, { status: 403 })
  }

  const body = await request.json()
  const { statusNaloga, role } = body

  if (id === (session.user as any).id && (statusNaloga === 'SUSPENDOVAN' || statusNaloga === 'OBRISAN')) {
    return NextResponse.json({ error: 'Ne možete suspendovati sopstveni nalog' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(statusNaloga && { statusNaloga }),
      ...(role && { role }),
    },
    select: {
      id: true,
      ime: true,
      email: true,
      role: true,
      statusNaloga: true,
      datumRegistracije: true,
    },
  })

  return NextResponse.json(updated)
}
