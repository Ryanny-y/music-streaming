import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

import type { Song } from '@/types'

type PlaybackContextValue = {
  currentSong: Song | null
  isPlaying: boolean
  playSong: (song: Song) => void
  togglePlayback: () => void
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null)

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

export function usePlayback() {
  const context = useContext(PlaybackContext)

  if (!context) {
    throw new Error('usePlayback must be used within PlaybackProvider')
  }

  return context
}
