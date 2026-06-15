'use client'

import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { GuestModal } from './GuestModal'

const GUEST_LIMIT_SECONDS = 60

export function PodcastAudioPlayer({ src, title }: { src: string; title: string }) {
  const { status } = useSession()
  const [showGuestModal, setShowGuestModal] = useState(false)
  const hasTriggered = useRef(false)
  const playerRef = useRef<any>(null)

  function handleListen(e: Event) {
    if (status !== 'unauthenticated') return
    if (hasTriggered.current) return

    const audio = e.target as HTMLAudioElement
    if (audio.currentTime >= GUEST_LIMIT_SECONDS) {
      audio.pause()
      hasTriggered.current = true
      setShowGuestModal(true)
    }
  }

  return (
    <>
      {showGuestModal && (
        <GuestModal onClose={() => setShowGuestModal(false)} />
      )}

      <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Slušaš</p>
          <p className="text-sm font-semibold text-zinc-100 truncate">{title}</p>
          {status === 'unauthenticated' && (
            <p className="text-xs text-indigo-400 mt-1">
              🎵 Besplatni preview - prvih 60 sekundi
            </p>
          )}
        </div>
        <AudioPlayer
          ref={playerRef}
          src={src}
          showJumpControls={true}
          showSkipControls={false}
          layout="stacked-reverse"
          customAdditionalControls={[]}
          listenInterval={1000}
          onListen={handleListen}
          style={{
            background: 'transparent',
            boxShadow: 'none',
          }}
        />
      </div>
    </>
  )
}
