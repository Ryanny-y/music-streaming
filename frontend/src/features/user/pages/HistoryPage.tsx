import { Eye, Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/usePlayback'
import { songService, userService } from '@/services'
import type { ListeningHistory, Song } from '@/types'

export function HistoryPage() {
  const { user } = useAuth()
  const { playSong } = usePlayback()
  const [history, setHistory] = useState<ListeningHistory[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      return
    }

    Promise.all([userService.getListeningHistory(user.id), songService.getPublishedSongs()])
      .then(([listeningHistory, publishedSongs]) => {
        setHistory(listeningHistory)
        setSongs(publishedSongs)
      })
      .finally(() => setIsLoading(false))
  }, [user])

  const rows = useMemo(
    () =>
      history
        .map((item) => ({
          history: item,
          song: songs.find((song) => song.id === item.songId),
        }))
        .filter((item): item is { history: ListeningHistory; song: Song } => Boolean(item.song)),
    [history, songs],
  )

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Recently played"
        title="Listening History"
        description="Replay songs you listened to recently or jump back into the details."
      />

      {isLoading ? (
        <LoadingState label="Loading history" />
      ) : rows.length === 0 ? (
        <EmptyState title="No listening history yet" description="Songs will appear here after you press play." />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card/80">
          {rows.map(({ history: item, song }) => (
            <div className="grid gap-4 p-4 md:grid-cols-[1fr_12rem_auto] md:items-center" key={item.id}>
              <div className="flex min-w-0 items-center gap-4">
                <img
                  className="size-14 rounded-md object-cover"
                  src={song.coverImageUrl}
                  alt={`${song.title} cover`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{song.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{formatDateTime(item.playedAt)}</p>
              <div className="flex gap-2">
                <Button size="sm" type="button" onClick={() => playSong(song)}>
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  Play again
                </Button>
                <Button size="sm" variant="secondary" type="button" onClick={() => navigate(`/app/songs/${song.id}`)}>
                  <Eye className="size-4" aria-hidden="true" />
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}
