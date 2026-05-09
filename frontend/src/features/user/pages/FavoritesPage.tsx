import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SongCard, SongList } from '@/components/common'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/usePlayback'
import { userService } from '@/services'
import type { Song } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load favorites right now.'
}

export function FavoritesPage() {
  const { user } = useAuth()
  const { playSong } = usePlayback()
  const [favorites, setFavorites] = useState<Song[]>([])
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
      .getFavorites(user.id)
      .then((favoriteSongs) => {
        if (isMounted) {
          setFavorites(favoriteSongs)
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setFavorites([])
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

  const removeFavorite = async (song: Song) => {
    if (!user) return

    try {
      await userService.removeFavorite(user.id, song.id)
      setFavorites((items) => items.filter((item) => item.id !== song.id))
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your collection"
        title="Favorites"
        description="Songs you marked for quick replay."
      />

      {isLoading ? (
        <LoadingState label="Loading favorites" />
      ) : errorMessage ? (
        <EmptyState title="Could not load favorites" description={errorMessage} />
      ) : favorites.length === 0 ? (
        <EmptyState title="No favorite songs yet" description="Favorite songs from the player or library to see them here." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {favorites.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                showFavorite
                isFavorite
                onPlay={playSong}
                onOpen={() => navigate(`/app/songs/${song.id}`)}
                onFavoriteToggle={removeFavorite}
              />
            ))}
          </div>
          <SongList songs={favorites} showFavorite favoriteSongIds={favorites.map((song) => song.id)} onPlay={playSong} onFavoriteToggle={removeFavorite} />
        </>
      )}
    </div>
  )
}
