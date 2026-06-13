'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/Button'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-indigo-600 tracking-tight">
          Podcast Platforma
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            Početna
          </Link>

          {status === 'loading' && (
            <span className="text-sm text-slate-400 px-3">...</span>
          )}

          {status === 'unauthenticated' && (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
              >
                Registracija
              </Link>
            </>
          )}

          {status === 'authenticated' && (
            <>
              <Link
                href="/favorites"
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                Omiljeno
              </Link>
              <Link
                href="/subscriptions"
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              >
                Pretplate
              </Link>
              {(session.user as any).role === 'KREATOR' && (
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {(session.user as any).role === 'ADMIN' && (
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-slate-400 px-2 hidden sm:block">
                {session.user?.name}
              </span>
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1.5 text-sm"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
