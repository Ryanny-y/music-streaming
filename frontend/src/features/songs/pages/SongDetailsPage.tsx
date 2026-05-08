import { Calendar, Clock3, Disc3, Lock, Music2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, TagBadge } from '@/components/common'
import { Button } from '@/components/ui'
import { songService } from '@/services'
import type { Song } from '@/types'

export function SongDetailsPage() {
  const { songId } = useParams()
  const [song, setSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!songId) {
      return
    }

    songService
      .getSongById(songId)
      .then(setSong)
      .finally(() => setIsLoading(false))
  }, [songId])

  if (isLoading) {
    return <LoadingState label="Loading song details" />
  }

  if (!song) {
    return (
      <EmptyState
        title="Song not found"
        description="This song may be unpublished or no longer available in the public catalog."
      />
    )
  }

  const lyricPreview = song.lyrics.split(/\r?\n| \/ /).filter(Boolean).slice(0, 4)

  return (
    <div className="space-y-8">
      <section className="grid gap-8 rounded-lg border border-border bg-card/80 p-6 shadow-2xl shadow-black/20 lg:grid-cols-[22rem_1fr]">
        <div className="overflow-hidden rounded-lg bg-secondary shadow-xl shadow-black/30">
          <img
            className="aspect-square w-full object-cover"
            src={song.coverImageUrl}
            alt={`${song.title} cover`}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-normal text-primary">{song.categoryName}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">{song.title}</h1>
          <p className="mt-3 text-xl text-muted-foreground">{song.artist}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {song.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>

          <p className="mt-7 max-w-2xl text-sm leading-6 text-muted-foreground">{song.description}</p>

          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <Detail icon={<Disc3 className="size-4" />} label="Album" value={song.album} />
            <Detail icon={<Music2 className="size-4" />} label="Category" value={song.categoryName} />
            <Detail icon={<Calendar className="size-4" />} label="Release date" value={formatDate(song.releaseDate)} />
            <Detail icon={<Clock3 className="size-4" />} label="Duration" value={formatDuration(song.duration)} />
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-lg border border-border bg-card/80 p-6">
          <h2 className="text-2xl font-semibold text-foreground">Lyrics Preview</h2>
          <div className="mt-6 space-y-3 text-lg leading-8 text-muted-foreground">
            {lyricPreview.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
            Full lyrics and playback are available after login.
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-primary/30 bg-[linear-gradient(135deg,hsl(346_94%_60%/.2),hsl(235_18%_10%))] p-6">
          <div className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <Lock className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-foreground">Login to listen fully</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Create a free mock account or sign in to unlock full playback, favorites, history, and your library.
          </p>
          <div className="mt-6 grid gap-3">
            <Button asChild>
              <Link to="/login">Login to Listen</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </aside>
      </div>
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
    <div className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-4">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <dt className="text-xs uppercase tracking-normal text-muted-foreground">{label}</dt>
        <dd className="mt-1 font-medium text-foreground">{value}</dd>
      </div>
    </div>
  )
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}
