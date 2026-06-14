'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  function navLink(href: string, label: string) {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return (
      <Link
        href={href}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          isActive
            ? 'text-zinc-100 bg-zinc-800'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-zinc-100 tracking-tight hover:text-white transition-colors"
        >
          Podcast Platforma
        </Link>

        <div className="flex items-center gap-1">
          {navLink('/', 'Početna')}
          {navLink('/api-docs', 'API Docs')}

          {status === 'loading' && (
            <span className="text-sm text-zinc-600 px-3">...</span>
          )}

          {status === 'unauthenticated' && (
            <>
              {navLink('/login', 'Login')}
              <Link
                href="/register"
                className={`ml-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === '/register'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                Registracija
              </Link>
            </>
          )}

          {status === 'authenticated' && (
            <>
              {navLink('/favorites', 'Omiljeno')}
              {navLink('/subscriptions', 'Pretplate')}
              {(session.user as any).role === 'KREATOR' && navLink('/dashboard', 'Dashboard')}
              {(session.user as any).role === 'ADMIN' && navLink('/dashboard', 'Dashboard')}
              {(session.user as any).role === 'ADMIN' && navLink('/admin/users', 'Admin')}
              <div className="flex items-center gap-2 ml-2 pl-3 border-l border-zinc-800">
                <span className="text-sm text-zinc-500 hidden sm:block">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
