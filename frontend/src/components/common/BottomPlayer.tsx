import { Pause, Play, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui'
import type { Song } from '@/types'

type BottomPlayerProps = {
  song?: Song | null
  isPlaying?: boolean
  progress?: number
  onPlayPause?: () => void
}

export function BottomPlayer({ isPlaying = false, onPlayPause, progress = 34, song }: BottomPlayerProps) {
  const currentSong = song ?? {
    title: 'Aurora Line',
    artist: 'Mira Vale',
    coverImageUrl: '/covers/aurora-line.jpg',
  }

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

        <div className="hidden items-center gap-4 md:flex">
          <Button className="rounded-full" size="icon" type="button" onClick={onPlayPause} aria-label="Play or pause">
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </Button>
          <div className="h-1.5 flex-1 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
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
