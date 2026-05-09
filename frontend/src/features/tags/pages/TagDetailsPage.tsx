import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SongCard, SongList } from '@/components/common'
import { usePlayback } from '@/features/user/usePlayback'
import { songService, tagService } from '@/services'
import type { Song, Tag } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load tag songs right now.'
}

export function TagDetailsPage() {
  const { tagId } = useParams()
  const [tag, setTag] = useState<Tag | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { playSong } = usePlayback()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    if (!tagId) {
      setTag(null)
      setSongs([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    Promise.all([tagService.getTagById(tagId), songService.getSongsByTag(tagId)])
      .then(([tagDetails, tagSongs]) => {
        if (!isMounted) {
          return
        }

        setTag(tagDetails)
        setSongs(tagSongs)
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setTag(null)
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
  }, [tagId])

  if (isLoading) {
    return <LoadingState label="Loading tag" />
  }

  if (errorMessage) {
    return <EmptyState title="Could not load tag" description={errorMessage} />
  }

  if (!tag) {
    return <EmptyState title="Tag not found" description="This tag is not available." />
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Tag" title={tag.name} description={`${tag.songCount} songs are marked with this tag.`} />

      {songs.length === 0 ? (
        <EmptyState title="No songs for this tag" description="Songs will appear here when available." />
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
