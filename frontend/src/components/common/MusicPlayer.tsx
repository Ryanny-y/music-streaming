import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Song } from '@/types'

type MusicPlayerProps = {
  song: Song
  isPlaying?: boolean
  progress?: number
  currentTime?: number
  duration?: number
  onPlayPause?: () => void
  seekTo?: (seconds: number) => void
}

export function MusicPlayer({ isPlaying = false, onPlayPause, progress = 42, currentTime = 0, duration = 0, song, seekTo }: MusicPlayerProps) {
  // Use duration from audio if available, fallback to song.duration
  const displayDuration = duration > 0 ? duration : song.duration
  const displayProgress = displayDuration > 0 ? (currentTime / displayDuration) * 100 : progress

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
          <span className="text-xs text-muted-foreground">{formatDuration(currentTime)}</span>
          <div className="relative flex-1 h-2">
            <div className="absolute top-0 left-0 h-2 w-full rounded-full bg-secondary" />
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-primary"
              style={{ width: `${displayProgress}%` }}
            />
            <input
              type="range"
              min={0}
              max={displayDuration}
              value={currentTime}
              onChange={e => seekTo && seekTo(Number(e.target.value))}
              className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
              aria-label="Seek"
              disabled={!seekTo || displayDuration === 0}
            />
          </div>
          <span className="text-xs text-muted-foreground">{formatDuration(displayDuration)}</span>
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
  if (!duration || isNaN(duration)) return '0:00'
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
