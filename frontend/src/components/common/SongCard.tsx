import { Heart, Play } from 'lucide-react'

import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Song } from '@/types'

import { TagBadge } from './TagBadge'

type SongCardProps = {
  song: Song
  showFavorite?: boolean
  isFavorite?: boolean
  onPlay?: (song: Song) => void
  onFavoriteToggle?: (song: Song) => void
  className?: string
}

export function SongCard({
  className,
  isFavorite = false,
  onFavoriteToggle,
  onPlay,
  showFavorite = false,
  song,
}: SongCardProps) {
  return (
    <article
      className={cn(
        'group overflow-hidden rounded-lg border border-border bg-card/80 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-primary/50',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          className="size-full object-cover"
          src={song.coverImageUrl}
          alt={`${song.title} cover`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <Button
          className="absolute bottom-3 right-3 rounded-full shadow-lg shadow-black/30"
          size="icon"
          type="button"
          onClick={() => onPlay?.(song)}
          aria-label={`Play ${song.title}`}
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{song.title}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{song.artist}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-normal text-primary">{song.categoryName}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {song.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>

        {showFavorite ? (
          <Button
            className="w-full"
            variant="secondary"
            type="button"
            onClick={() => onFavoriteToggle?.(song)}
          >
            <Heart className={cn('size-4', isFavorite && 'fill-current text-primary')} aria-hidden="true" />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
        ) : null}
      </div>
    </article>
  )
}
