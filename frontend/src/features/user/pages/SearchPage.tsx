import { Hash, Mic2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader, SearchBar, SongCard } from '@/components/common'
import { usePlayback } from '@/features/user/playbackContext'
import { categoryService, songService, tagService } from '@/services'
import type { Category, Song, Tag } from '@/types'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { playSong } = usePlayback()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([songService.getPublishedSongs(), categoryService.getCategories(), tagService.getTags()])
      .then(([publishedSongs, musicCategories, musicTags]) => {
        setSongs(publishedSongs)
        setCategories(musicCategories)
        setTags(musicTags)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return {
        songs: songs.slice(0, 4),
        artists: uniqueArtists(songs).slice(0, 6),
        categories: categories.slice(0, 4),
        tags: tags.slice(0, 6),
      }
    }

    return {
      songs: songs.filter((song) =>
        [song.title, song.artist, song.album, song.categoryName, ...song.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      ),
      artists: uniqueArtists(songs).filter((artist) => artist.toLowerCase().includes(normalizedQuery)),
      categories: categories.filter((category) =>
        [category.name, category.description].join(' ').toLowerCase().includes(normalizedQuery),
      ),
      tags: tags.filter((tag) => tag.name.toLowerCase().includes(normalizedQuery)),
    }
  }, [categories, query, songs, tags])

  const hasResults =
    results.songs.length > 0 || results.artists.length > 0 || results.categories.length > 0 || results.tags.length > 0

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Search"
        title="Find your next song"
        description="Search across songs, artists, categories, and tags."
      />
      <SearchBar value={query} onChange={setQuery} placeholder="Search songs, artists, moods, or categories" />

      {isLoading ? (
        <LoadingState label="Searching catalog" />
      ) : !hasResults ? (
        <EmptyState title="No results found" description="Try searching another song, artist, category, or tag." />
      ) : (
        <div className="space-y-10">
          <section className="space-y-5">
            <PageHeader title="Songs" />
            {results.songs.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {results.songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    showFavorite
                    onPlay={playSong}
                    onOpen={() => navigate(`/app/songs/${song.id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No songs matched" />
            )}
          </section>

          <section className="space-y-5">
            <PageHeader title="Artists" />
            {results.artists.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.artists.map((artist) => (
                  <button
                    className="flex items-center gap-3 rounded-lg border border-border bg-card/80 p-4 text-left transition hover:border-primary/60"
                    key={artist}
                    type="button"
                    onClick={() => setQuery(artist)}
                  >
                    <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                      <Mic2 className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-medium text-foreground">{artist}</span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState title="No artists matched" />
            )}
          </section>

          <section className="space-y-5">
            <PageHeader title="Categories" />
            {results.categories.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {results.categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => navigate(`/app/categories/${category.id}`)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No categories matched" />
            )}
          </section>

          <section className="space-y-5">
            <PageHeader title="Tags" />
            {results.tags.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.tags.map((tag) => (
                  <button
                    className="flex items-center justify-between rounded-lg border border-border bg-card/80 p-4 text-left transition hover:border-primary/60"
                    key={tag.id}
                    type="button"
                    onClick={() => navigate(`/app/tags/${tag.id}`)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                        <Hash className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-medium text-foreground">{tag.name}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">{tag.songCount}</span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState title="No tags matched" />
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function uniqueArtists(songs: Song[]): string[] {
  return Array.from(new Set(songs.map((song) => song.artist))).sort((a, b) => a.localeCompare(b))
}
