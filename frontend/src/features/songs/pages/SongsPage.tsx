import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SearchBar, SongCard } from '@/components/common'
import { categoryService, songService, tagService } from '@/services'
import type { Category, Song, Tag } from '@/types'

export function SongsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const searchValue = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''
  const selectedTag = searchParams.get('tag') ?? ''

  useEffect(() => {
    Promise.all([songService.getPublishedSongs(), categoryService.getCategories(), tagService.getTags()])
      .then(([publishedSongs, musicCategories, musicTags]) => {
        setSongs(publishedSongs)
        setCategories(musicCategories)
        setTags(musicTags)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filteredSongs = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const normalizedTag = selectedTag.trim().toLowerCase()

    return songs.filter((song) => {
      const matchesSearch =
        !normalizedSearch ||
        [song.title, song.artist, song.album, song.description, song.categoryName, ...song.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch)
      const matchesCategory = !selectedCategory || song.categoryId === selectedCategory
      const matchesTag = !normalizedTag || song.tags.some((tag) => tag.toLowerCase() === normalizedTag)

      return matchesSearch && matchesCategory && matchesTag
    })
  }, [searchValue, selectedCategory, selectedTag, songs])

  const updateFilter = (key: 'category' | 'tag' | 'q', value: string) => {
    const nextParams = new URLSearchParams(searchParams)

    if (value) {
      nextParams.set(key, value)
    } else {
      nextParams.delete(key)
    }

    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Public catalog"
        title="Browse Songs"
        description="Explore published songs, filter by category or tag, and preview details before signing in."
      />

      <section className="grid gap-4 rounded-lg border border-border bg-card/70 p-4 md:grid-cols-[1fr_14rem_14rem]">
        <SearchBar
          value={searchValue}
          onChange={(value) => updateFilter('q', value)}
          placeholder="Search by song, artist, album, or mood"
        />

        <select
          className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={selectedCategory}
          onChange={(event) => updateFilter('category', event.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={selectedTag}
          onChange={(event) => updateFilter('tag', event.target.value)}
          aria-label="Filter by tag"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
      </section>

      {isLoading ? (
        <LoadingState label="Loading songs" />
      ) : filteredSongs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} onOpen={() => navigate(`/songs/${song.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No songs found"
          description="Try a different search term, category, or tag filter."
        />
      )}
    </div>
  )
}
