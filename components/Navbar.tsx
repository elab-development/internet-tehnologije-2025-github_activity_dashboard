'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const role = (session?.user as { role?: string } | undefined)?.role

  function navLink(href: string, label: string) {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return (
      <Link
        href={href}
        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
          isActive
            ? 'bg-zinc-800 text-white font-medium'
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
        }`}
      >
        {label}
      </Link>
    )
  }

  function mobileNavLink(href: string, label: string) {
    return (
      <Link
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className="px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors"
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-zinc-100 tracking-tight hover:text-white transition-colors"
        >
          🎙️ Podcast Platforma
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
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
              {role === 'KREATOR' && navLink('/dashboard', 'Dashboard')}
              {role === 'ADMIN' && navLink('/dashboard', 'Dashboard')}
              {role === 'ADMIN' && navLink('/admin/users', 'Admin')}
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

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-300"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 p-4 flex flex-col gap-2">
          {mobileNavLink('/', 'Početna')}
          {mobileNavLink('/api-docs', 'API Docs')}

          {status === 'unauthenticated' && (
            <>
              {mobileNavLink('/login', 'Login')}
              {mobileNavLink('/register', 'Registracija')}
            </>
          )}

          {status === 'authenticated' && (
            <>
              {mobileNavLink('/favorites', 'Omiljeno')}
              {mobileNavLink('/subscriptions', 'Pretplate')}
              {role === 'KREATOR' && mobileNavLink('/dashboard', 'Dashboard')}
              {role === 'ADMIN' && mobileNavLink('/dashboard', 'Dashboard')}
              {role === 'ADMIN' && mobileNavLink('/admin/users', 'Admin')}
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMobileMenuOpen(false) }}
                className="px-3 py-2 rounded-lg hover:bg-zinc-800 text-zinc-300 text-left transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
