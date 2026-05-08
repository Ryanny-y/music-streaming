import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Song } from '@/types'

type MusicPlayerProps = {
  song: Song
  isPlaying?: boolean
  progress?: number
  onPlayPause?: () => void
}

export function MusicPlayer({ isPlaying = false, onPlayPause, progress = 42, song }: MusicPlayerProps) {
  return (
    <section className="grid gap-8 rounded-lg border border-border bg-card/80 p-6 shadow-2xl shadow-black/20 lg:grid-cols-[18rem_1fr]">
      <img
        className="aspect-square w-full rounded-lg object-cover shadow-xl shadow-black/30"
        src={song.coverImageUrl}
        alt={`${song.title} cover`}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />

      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium uppercase tracking-normal text-primary">{song.categoryName}</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">{song.title}</h2>
        <p className="mt-2 text-lg text-muted-foreground">{song.artist}</p>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-muted-foreground">{song.description}</p>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="ghost" size="icon" type="button" aria-label="Shuffle">
            <Shuffle className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" type="button" aria-label="Previous song">
            <SkipBack className="size-5 fill-current" aria-hidden="true" />
          </Button>
          <Button className="size-14 rounded-full" type="button" onClick={onPlayPause} aria-label="Play or pause">
            {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </Button>
          <Button variant="ghost" size="icon" type="button" aria-label="Next song">
            <SkipForward className="size-5 fill-current" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon" type="button" aria-label="Repeat">
            <Repeat className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <span className="text-xs text-muted-foreground">0:00</span>
          <div className="h-2 flex-1 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{formatDuration(song.duration)}</span>
        </div>

        <div className="mt-5 flex items-center gap-3 text-muted-foreground">
          <Volume2 className="size-4" aria-hidden="true" />
          <div className="h-1.5 w-28 rounded-full bg-secondary">
            <div className="h-full w-2/3 rounded-full bg-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  )
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
