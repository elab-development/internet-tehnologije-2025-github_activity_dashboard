'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function GuestModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="text-4xl mb-4">🎙️</div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">
          Uživaš u podkastu?
        </h2>
        <p className="text-zinc-400 mb-6">
          Registruj se besplatno i slušaj bez ograničenja. Prati omiljene autore, komentariši i dodaj u omiljene.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/register')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Registruj se besplatno
          </button>
          <button
            onClick={() => signIn('google', { callbackUrl: window.location.href })}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span>G</span> Nastavi sa Google
          </button>
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-2"
          >
            Već imaš nalog? Prijavi se
          </button>
        </div>
      </div>
    </div>
  )
}
