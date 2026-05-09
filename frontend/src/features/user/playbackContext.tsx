import { useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react'

import { api } from '@/lib/api'
import { getSongStreamPath } from '@/lib/media'
import type { Song } from '@/types'

import { PlaybackContext, type PlaybackContextValue } from './playbackContextValue'

export function PlaybackProvider({ children }: PropsWithChildren) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const updateProgress = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) {
        setProgress(0)
        return
      }

      setProgress((audio.currentTime / audio.duration) * 100)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('loadedmetadata', updateProgress)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('loadedmetadata', updateProgress)
      audio.removeEventListener('ended', handleEnded)

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const playAudio = async (song: Song) => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)

    try {
      const response = await api.get<Blob>(getSongStreamPath(song.id), { responseType: 'blob' })

      if (requestIdRef.current !== requestId) {
        return
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      const objectUrl = URL.createObjectURL(response.data)
      objectUrlRef.current = objectUrl
      audio.src = objectUrl
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }

  const value = useMemo<PlaybackContextValue>(
    () => ({
      currentSong,
      isPlaying,
      progress,
      playSong: (song) => {
        void playAudio(song)
      },
      togglePlayback: () => {
        const audio = audioRef.current

        if (!audio || !currentSong) {
          return
        }

        if (audio.paused) {
          void audio.play().then(() => setIsPlaying(true))
          return
        }

        audio.pause()
        setIsPlaying(false)
      },
    }),
    [currentSong, isPlaying, progress],
  )

  return <PlaybackContext value={value}>{children}</PlaybackContext>
}
