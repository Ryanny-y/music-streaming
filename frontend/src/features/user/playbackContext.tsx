import { useMemo, useState, type PropsWithChildren } from 'react'

import type { Song } from '@/types'

import { PlaybackContext, type PlaybackContextValue } from './playbackContextValue'

export function PlaybackProvider({ children }: PropsWithChildren) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const value = useMemo<PlaybackContextValue>(
    () => ({
      currentSong,
      isPlaying,
      playSong: (song) => {
        setCurrentSong(song)
        setIsPlaying(true)
      },
      togglePlayback: () => setIsPlaying((playing) => !playing),
    }),
    [currentSong, isPlaying],
  )

  return <PlaybackContext value={value}>{children}</PlaybackContext>
}
