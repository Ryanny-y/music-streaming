import { createContext } from 'react'

import type { Song } from '@/types'

export type PlaybackContextValue = {
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  currentTime: number
  duration: number
  playSong: (song: Song) => void
  togglePlayback: () => void
  seekTo: (seconds: number) => void
}

export const PlaybackContext = createContext<PlaybackContextValue | null>(null)
