import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SongCard, SongList } from '@/components/common'
import { usePlayback } from '@/features/user/usePlayback'
import { categoryService, songService } from '@/services'
import type { Category, Song } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load category songs right now.'
}

export function CategoryDetailsPage() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { playSong } = usePlayback()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    if (!categoryId) {
      setCategory(null)
      setSongs([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    Promise.all([categoryService.getCategoryById(categoryId), songService.getSongsByCategory(categoryId)])
      .then(([categoryDetails, categorySongs]) => {
        if (!isMounted) {
          return
        }

        setCategory(categoryDetails)
        setSongs(categorySongs)
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setCategory(null)
        setSongs([])
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
  }, [categoryId])

  if (isLoading) {
    return <LoadingState label="Loading category" />
  }

  if (errorMessage) {
    return <EmptyState title="Could not load category" description={errorMessage} />
  }

  if (!category) {
    return <EmptyState title="Category not found" description="This category is not available." />
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Category" title={category.name} description={category.description} />

      {songs.length === 0 ? (
        <EmptyState title="No songs in this category" description="Published songs will appear here when available." />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                showFavorite
                onPlay={playSong}
                onOpen={() => navigate(`/app/songs/${song.id}`)}
              />
            ))}
          </div>
          <SongList
            songs={songs}
            showFavorite
            onPlay={playSong}
            onOpen={(song) => navigate(`/app/songs/${song.id}`)}
          />
        </>
      )}
    </div>
  )
}
