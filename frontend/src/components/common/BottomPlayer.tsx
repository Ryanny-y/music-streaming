import { Pause, Play, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Song } from '@/types'

type BottomPlayerProps = {
  song?: Song | null
  isPlaying?: boolean
  progress?: number
  currentTime?: number
  duration?: number
  onPlayPause?: () => void
  seekTo?: (seconds: number) => void
}

export function BottomPlayer({ isPlaying = false, onPlayPause, progress = 34, currentTime = 0, duration = 0, song, seekTo }: BottomPlayerProps) {
  const currentSong = song ?? {
    title: 'Aurora Line',
    artist: 'Mira Vale',
    coverImageUrl: '/covers/aurora-line.jpg',
  }

  const displayDuration = duration > 0 ? duration : song?.duration ?? 0
  const displayProgress = displayDuration > 0 ? (currentTime / displayDuration) * 100 : progress

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur md:left-64">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_2fr_1fr]">
        <div className="flex min-w-0 items-center gap-3">
          <img
            className="size-12 rounded-md object-cover"
            src={currentSong.coverImageUrl}
            alt={`${currentSong.title} cover`}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{currentSong.title}</p>
            <p className="truncate text-xs text-muted-foreground">{currentSong.artist}</p>
          </div>
        </div>

        {/* Desktop: show interactive progress bar */}
        <div className="hidden items-center gap-4 md:flex">
          <Button className="rounded-full" size="icon" type="button" onClick={onPlayPause} aria-label="Play or pause">
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </Button>
          <span className="text-xs text-muted-foreground">{formatDuration(currentTime)}</span>
          <div className="relative flex-1 h-1.5">
            <div className="absolute top-0 left-0 h-1.5 w-full rounded-full bg-secondary" />
            <div
              className="absolute top-0 left-0 h-1.5 rounded-full bg-primary"
              style={{ width: `${displayProgress}%` }}
            />
            <input
              type="range"
              min={0}
              max={displayDuration}
              value={currentTime}
              onChange={e => seekTo && seekTo(Number(e.target.value))}
              className="absolute top-0 left-0 w-full h-1.5 opacity-0 cursor-pointer"
              aria-label="Seek"
              disabled={!seekTo || displayDuration === 0}
            />
          </div>
          <span className="text-xs text-muted-foreground">{formatDuration(displayDuration)}</span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button className="md:hidden" size="icon" type="button" onClick={onPlayPause} aria-label="Play or pause">
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </Button>
          <Volume2 className="hidden size-5 text-muted-foreground md:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

function formatDuration(duration: number): string {
  if (!duration || isNaN(duration)) return '0:00'
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
