import { Heart, Play } from 'lucide-react'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Song } from '@/types'

type SongListProps = {
  songs: Song[]
  showFavorite?: boolean
  favoriteSongIds?: string[]
  onOpen?: (song: Song) => void
  onPlay?: (song: Song) => void
  onFavoriteToggle?: (song: Song) => void
  className?: string
}

export function SongList({
  className,
  favoriteSongIds = [],
  onOpen,
  onFavoriteToggle,
  onPlay,
  showFavorite = false,
  songs,
}: SongListProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-card/70', className)}>
      <div className="hidden grid-cols-[3rem_1fr_12rem_8rem_5rem] gap-4 border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-normal text-muted-foreground md:grid">
        <span />
        <span>Song</span>
        <span>Category</span>
        <span>Duration</span>
        <span />
      </div>

      <div className="divide-y divide-border">
        {songs.map((song) => {
          const isFavorite = favoriteSongIds.includes(song.id)

          return (
            <div
              className={cn(
                'grid gap-4 px-4 py-3 md:grid-cols-[3rem_1fr_12rem_8rem_5rem] md:items-center',
                onOpen && 'cursor-pointer transition hover:bg-secondary/50',
              )}
              key={song.id}
              role={onOpen ? 'button' : undefined}
              tabIndex={onOpen ? 0 : undefined}
              onClick={() => onOpen?.(song)}
              onKeyDown={(event) => {
                if (onOpen && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  onOpen(song)
                }
              }}
            >
              <button
                className="hidden size-10 items-center justify-center rounded-full bg-primary text-primary-foreground md:flex"
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onPlay?.(song)
                }}
                aria-label={`Play ${song.title}`}
              >
                <Play className="size-4 fill-current" aria-hidden="true" />
              </button>

              <div className="flex min-w-0 items-center gap-3">
                <img
                  className="size-12 rounded-md object-cover"
                  src={song.coverImageUrl}
                  alt={`${song.title} cover`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{song.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{song.categoryName}</p>
              <p className="text-sm text-muted-foreground">{formatDuration(song.duration)}</p>

              <div className="flex items-center gap-2">
                <Button
                  className="md:hidden"
                  size="sm"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onPlay?.(song)
                  }}
                >
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  Play
                </Button>
                {showFavorite ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onFavoriteToggle?.(song)
                    }}
                    aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
                  >
                    <Heart className={cn('size-4', isFavorite && 'fill-current text-primary')} aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
