import { Eye, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/usePlayback'
import { userService } from '@/services'
import type { Song } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load listening history right now.'
}

export function HistoryPage() {
  const { user } = useAuth()
  const { playSong } = usePlayback()
  const [history, setHistory] = useState<userService.ListeningHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    userService
      .getListeningHistoryItems()
      .then((listeningHistory) => {
        if (isMounted) {
          setHistory(listeningHistory)
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setHistory([])
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user])

  const openSong = (song: Song) => {
    navigate(`/app/songs/${song.id}`)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Recently played"
        title="Listening History"
        description="Replay songs you listened to recently or jump back into the details."
      />

      {isLoading ? (
        <LoadingState label="Loading history" />
      ) : errorMessage ? (
        <EmptyState title="Could not load listening history" description={errorMessage} />
      ) : history.length === 0 ? (
        <EmptyState title="No listening history yet" description="Songs will appear here after you press play." />
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card/80">
          {history.map((item) => (
            <div
              className="grid cursor-pointer gap-4 p-4 transition hover:bg-secondary/50 md:grid-cols-[1fr_12rem_auto] md:items-center"
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => openSong(item.song)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openSong(item.song)
                }
              }}
            >
              <div className="flex min-w-0 items-center gap-4">
                <img
                  className="size-14 rounded-md object-cover"
                  src={item.song.coverImageUrl}
                  alt={`${item.song.title} cover`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{item.song.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{item.song.artist}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{formatDateTime(item.playedAt)}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    playSong(item.song)
                  }}
                >
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  Play again
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    openSong(item.song)
                  }}
                >
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
