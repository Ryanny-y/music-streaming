import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SongCard, SongList } from '@/components/common'
import { usePlayback } from '@/features/user/usePlayback'
import { songService, tagService } from '@/services'
import type { Song, Tag } from '@/types'

export function TagDetailsPage() {
  const { tagId } = useParams()
  const [tag, setTag] = useState<Tag | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { playSong } = usePlayback()
  const navigate = useNavigate()

  useEffect(() => {
    if (!tagId) {
      return
    }

    tagService
      .getTagById(tagId)
      .then(async (tagDetails) => {
        setTag(tagDetails)
        setSongs(tagDetails ? await songService.getSongsByTag(tagDetails.name) : [])
      })
      .finally(() => setIsLoading(false))
  }, [tagId])

  if (isLoading) {
    return <LoadingState label="Loading tag" />
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
          <SongList songs={songs} showFavorite onPlay={playSong} />
        </>
      )}
    </div>
  )
}
