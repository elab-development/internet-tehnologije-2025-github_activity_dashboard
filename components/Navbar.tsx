'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-bold text-lg">
        Podcast Platforma
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/">Početna</Link>

        {status === 'loading' && <span>...</span>}

        {status === 'unauthenticated' && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Registracija</Link>
          </>
        )}

        {status === 'authenticated' && (
          <>
            <Link href="/favorites">Omiljeno</Link>
            <Link href="/subscriptions">Pretplate</Link>
            {(session.user as any).role === 'KREATOR' && (
              <Link href="/dashboard">Dashboard</Link>
            )}
            {(session.user as any).role === 'ADMIN' && (
              <Link href="/dashboard">Admin</Link>
            )}
            <span>{session.user?.name}</span>
            <button onClick={() => signOut({ callbackUrl: '/' })}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}