import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SearchBar, SongCard } from '@/components/common'
import { categoryService, songService, tagService } from '@/services'
import type { Category, Song, Tag } from '@/types'

function getBackendErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load songs right now.'
}

export function BrowseSongsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoadingFilters, setIsLoadingFilters] = useState(true)
  const [isLoadingSongs, setIsLoadingSongs] = useState(true)
  const navigate = useNavigate()

  const searchValue = searchParams.get('q') ?? ''
  const selectedCategory = searchParams.get('category') ?? ''
  const selectedTag = searchParams.get('tag') ?? ''

  useEffect(() => {
    let isMounted = true

    Promise.all([categoryService.getCategories(), tagService.getTags()])
      .then(([musicCategories, musicTags]) => {
        if (!isMounted) {
          return
        }

        setCategories(musicCategories)
        setTags(musicTags)
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(getBackendErrorMessage(error))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingFilters(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const normalizedSearch = searchValue.trim()

    setIsLoadingSongs(true)
    setErrorMessage('')

    const request = normalizedSearch
      ? songService.searchSongs(normalizedSearch)
      : songService.getPublishedSongs()

    request
      .then((publishedSongs) => {
        if (isMounted) {
          setSongs(publishedSongs.filter((song) => song.status === 'PUBLISHED'))
        }
      })
      .catch((error) => {
        if (isMounted) {
          setSongs([])
          setErrorMessage(getBackendErrorMessage(error))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingSongs(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [searchValue])

  const selectedCategoryName = useMemo(() => {
    return categories.find((category) => category.id === selectedCategory)?.name ?? selectedCategory
  }, [categories, selectedCategory])

  const filteredSongs = useMemo(() => {
    const normalizedCategory = selectedCategoryName.trim().toLowerCase()
    const normalizedTag = selectedTag.trim().toLowerCase()

    return songs.filter((song) => {
      const matchesCategory =
        !normalizedCategory ||
        song.categoryId === selectedCategory ||
        song.categoryName.toLowerCase() === normalizedCategory
      const matchesTag = !normalizedTag || song.tags.some((tag) => tag.toLowerCase() === normalizedTag)

      return song.status === 'PUBLISHED' && matchesCategory && matchesTag
    })
  }, [selectedCategory, selectedCategoryName, selectedTag, songs])

  const updateFilter = (key: 'category' | 'tag' | 'q', value: string) => {
    const nextParams = new URLSearchParams(searchParams)

    if (value) {
      nextParams.set(key, value)
    } else {
      nextParams.delete(key)
    }

    setSearchParams(nextParams, { replace: true })
  }

  const isLoading = isLoadingFilters || isLoadingSongs

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
          disabled={isLoadingFilters}
        />

        <select
          className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={selectedCategory}
          onChange={(event) => updateFilter('category', event.target.value)}
          aria-label="Filter by category"
          disabled={isLoadingFilters}
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
          disabled={isLoadingFilters}
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
      ) : errorMessage ? (
        <EmptyState title="Could not load songs" description={errorMessage} />
      ) : filteredSongs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} onOpen={() => navigate(`/songs/${song.id}`)} />
          ))}
        </div>
      ) : (
        <EmptyState title="No songs found" description="Try a different search term, category, or tag filter." />
      )}
    </div>
  )
}
