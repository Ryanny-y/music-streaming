import { Calendar, Clock3, Disc3, Eye, Heart, Music2, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, MusicPlayer, PageHeader, TagBadge } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/playbackContext'
import { songService, userService } from '@/services'
import type { Song } from '@/types'

export function AppSongDetailsPage() {
  const { songId } = useParams()
  const { user } = useAuth()
  const { currentSong, isPlaying, playSong, togglePlayback } = usePlayback()
  const [song, setSong] = useState<Song | null>(null)
  const [favorites, setFavorites] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!songId || !user) {
      setIsLoading(false)
      return
    }

    Promise.all([songService.getSongById(songId), userService.getFavorites(user.id)])
      .then(([songDetails, userFavorites]) => {
        setSong(songDetails)
        setFavorites(userFavorites)
      })
      .finally(() => setIsLoading(false))
  }, [songId, user])

  if (isLoading) {
    return <LoadingState label="Loading song" />
  }

  if (!song) {
    return <EmptyState title="Song not found" description="This song is not available for listening." />
  }

  const isFavorite = favorites.some((favorite) => favorite.id === song.id)
  const isCurrentSongPlaying = currentSong?.id === song.id && isPlaying

  const handlePlayPause = async () => {
    if (!user) return

    if (currentSong?.id === song.id) {
      togglePlayback()
      return
    }

    playSong(song)
    await songService.recordSongPlay(song.id, user.id)
    setSong({ ...song, playCount: song.playCount + 1 })
  }

  const handleFavoriteToggle = async () => {
    if (!user) return

    if (isFavorite) {
      await userService.removeFavorite(user.id, song.id)
      setFavorites((items) => items.filter((item) => item.id !== song.id))
      return
    }

    await userService.addFavorite(user.id, song.id)
    setFavorites((items) => [...items, song])
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Now playing"
        title={song.title}
        description={`${song.artist} - ${song.album}`}
        actions={
          <Button asChild variant="secondary">
            <Link to={`/app/songs/${song.id}/lyrics`}>
              <Eye className="size-4" aria-hidden="true" />
              View lyrics
            </Link>
          </Button>
        }
      />

      <MusicPlayer song={song} isPlaying={isCurrentSongPlaying} onPlayPause={handlePlayPause} />

      <section className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="rounded-lg border border-border bg-card/80 p-6">
          <div className="flex flex-wrap gap-2">
            {song.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">{song.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={handlePlayPause}>
              <Music2 className="size-4" aria-hidden="true" />
              {isCurrentSongPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button variant="secondary" type="button" onClick={handleFavoriteToggle}>
              <Heart className={isFavorite ? 'size-4 fill-current text-primary' : 'size-4'} aria-hidden="true" />
              {isFavorite ? 'Remove favorite' : 'Add favorite'}
            </Button>
          </div>
        </div>

        <dl className="grid gap-3">
          <Detail icon={<Disc3 className="size-4" />} label="Album" value={song.album} />
          <Detail icon={<Music2 className="size-4" />} label="Category" value={song.categoryName} />
          <Detail icon={<Calendar className="size-4" />} label="Released" value={formatDate(song.releaseDate)} />
          <Detail icon={<Clock3 className="size-4" />} label="Duration" value={formatDuration(song.duration)} />
          <Detail icon={<TrendingUp className="size-4" />} label="Plays" value={song.playCount.toLocaleString()} />
        </dl>
      </section>
    </div>
  )
}

type DetailProps = {
  icon: ReactNode
  label: string
  value: string
}

function Detail({ icon, label, value }: DetailProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card/80 p-4">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <dt className="text-xs uppercase tracking-normal text-muted-foreground">{label}</dt>
        <dd className="mt-1 font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

function formatDuration(duration: number): string {
  return `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
