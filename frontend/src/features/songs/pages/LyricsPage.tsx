import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, LyricsViewer, MusicPlayer, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { usePlayback } from '@/features/user/playbackContext'
import { songService } from '@/services'
import type { Song } from '@/types'

export function LyricsPage() {
  const { songId } = useParams()
  const { currentSong, isPlaying, playSong, togglePlayback } = usePlayback()
  const [song, setSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!songId) {
      setIsLoading(false)
      return
    }

    songService
      .getSongById(songId)
      .then(setSong)
      .finally(() => setIsLoading(false))
  }, [songId])

  if (isLoading) {
    return <LoadingState label="Loading lyrics" />
  }

  if (!song) {
    return <EmptyState title="Lyrics unavailable" description="This song is not available." />
  }

  const handlePlayPause = () => {
    if (currentSong?.id === song.id) {
      togglePlayback()
      return
    }

    playSong(song)
  }

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
      <MusicPlayer song={song} isPlaying={currentSong?.id === song.id && isPlaying} progress={28} onPlayPause={handlePlayPause} />
      <LyricsViewer lyrics={song.lyrics} title={`${song.title} lyrics`} />
    </div>
  )
}
