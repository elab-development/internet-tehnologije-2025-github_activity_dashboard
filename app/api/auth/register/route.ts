import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { ime, email, password, role } = await request.json()

    if (!ime || !email || !password) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Korisnik sa ovim emailom već postoji' },
        { status: 409 }
      )
    }

    const lozinkaHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        ime,
        email,
        lozinkaHash,
        role: role || 'SLUSALAC',
      },
    })

    return NextResponse.json(
      { id: user.id, email: user.email, ime: user.ime, role: user.role },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Greška na serveru' },
      { status: 500 }
    )
  }
}