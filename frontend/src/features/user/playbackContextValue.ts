import { createContext } from 'react'

import type { Song } from '@/types'

export type PlaybackContextValue = {
  currentSong: Song | null
  isPlaying: boolean
  progress: number
  playSong: (song: Song) => void
  togglePlayback: () => void
}

export const PlaybackContext = createContext<PlaybackContextValue | null>(null)
