import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SongCard, SongList } from '@/components/common'
import { usePlayback } from '@/features/user/playbackContext'
import { categoryService, songService } from '@/services'
import type { Category, Song } from '@/types'

export function CategoryDetailsPage() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState<Category | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { playSong } = usePlayback()
  const navigate = useNavigate()

  useEffect(() => {
    if (!categoryId) {
      setIsLoading(false)
      return
    }

    Promise.all([categoryService.getCategoryById(categoryId), songService.getSongsByCategory(categoryId)])
      .then(([categoryDetails, categorySongs]) => {
        setCategory(categoryDetails)
        setSongs(categorySongs)
      })
      .finally(() => setIsLoading(false))
  }, [categoryId])

  if (isLoading) {
    return <LoadingState label="Loading category" />
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
          <SongList songs={songs} showFavorite onPlay={playSong} />
        </>
      )}
    </div>
  )
}
