import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, LyricsViewer, MusicPlayer, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { usePlayback } from '@/features/user/usePlayback'
import { songService } from '@/services'
import type { Song } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load lyrics right now.'
}

export function LyricsPage() {
  const { songId } = useParams()
  const { currentSong, isPlaying, playSong, progress, togglePlayback, currentTime, duration, seekTo } = usePlayback()
  const [song, setSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!songId) {
      setSong(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    songService
      .getSongDetails(songId)
      .then((songDetails) => {
        if (isMounted) {
          setSong(songDetails)
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setSong(null)
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [songId])

  if (isLoading) {
    return <LoadingState label="Loading lyrics" />
  }

  if (errorMessage) {
    return <EmptyState title="Could not load lyrics" description={errorMessage} />
  }

  if (!song) {
    return <EmptyState title="Lyrics unavailable" description="This song is not available." />
  }

  const handlePlayPause = () => {
    if (currentSong?.id === song.id) {
      togglePlayback()
      return
    }

    void songService.recordSongPlay(song.id).catch(() => undefined)
    playSong(song)
  }

  const isCurrentSongPlaying = currentSong?.id === song.id && isPlaying

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Lyrics"
        title={song.title}
        description={song.artist}
        actions={
          <Button asChild variant="secondary">
            <Link to={`/app/songs/${song.id}`}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to song
            </Link>
          </Button>
        }
      />
      <MusicPlayer
        song={song}
        isPlaying={isCurrentSongPlaying}
        progress={isCurrentSongPlaying ? progress : 0}
        currentTime={isCurrentSongPlaying ? currentTime : 0}
        duration={isCurrentSongPlaying ? duration : song.duration}
        onPlayPause={handlePlayPause}
        seekTo={isCurrentSongPlaying ? seekTo : undefined}
      />
      <LyricsViewer lyrics={song.lyrics} title={`${song.title} lyrics`} />
    </div>
  )
}
