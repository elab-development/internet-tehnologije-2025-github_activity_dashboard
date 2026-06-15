'use client'

import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

export function PodcastAudioPlayer({ src, title }: { src: string; title: string }) {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Slušaš</p>
        <p className="text-sm font-semibold text-zinc-100 truncate">{title}</p>
      </div>
      <AudioPlayer
        src={src}
        showJumpControls={true}
        showSkipControls={false}
        layout="stacked-reverse"
        customAdditionalControls={[]}
        style={{
          background: 'transparent',
          boxShadow: 'none',
        }}
      />
    </div>
  )
}
