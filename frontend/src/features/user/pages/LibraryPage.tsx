import { Grid2X2, List } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SearchBar, SongCard, SongList } from '@/components/common'
import { Button } from '@/components/ui'
import { usePlayback } from '@/features/user/playbackContext'
import { categoryService, songService, tagService } from '@/services'
import type { Category, Song, Tag } from '@/types'

export function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tagName, setTagName] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
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

  const filteredSongs = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    const tag = tagName.trim().toLowerCase()

    return songs
      .filter((song) => {
        const matchesSearch =
          !query ||
          [song.title, song.artist, song.album, song.categoryName, ...song.tags].join(' ').toLowerCase().includes(query)
        const matchesCategory = !categoryId || song.categoryId === categoryId
        const matchesTag = !tag || song.tags.some((songTag) => songTag.toLowerCase() === tag)

        return matchesSearch && matchesCategory && matchesTag
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        if (sortBy === 'artist') return a.artist.localeCompare(b.artist)
        if (sortBy === 'most-played') return b.playCount - a.playCount
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      })
  }, [categoryId, searchValue, songs, sortBy, tagName])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your library"
        title="Library"
        description="Search, filter, and sort every published song available to listeners."
      />

      <section className="grid gap-4 rounded-lg border border-border bg-card/70 p-4 lg:grid-cols-[1fr_12rem_12rem_12rem_auto]">
        <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search library" />
        <FilterSelect value={categoryId} onChange={setCategoryId} label="Category">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={tagName} onChange={setTagName} label="Tag">
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect value={sortBy} onChange={setSortBy} label="Sort">
          <option value="newest">Newest</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="most-played">Most played</option>
        </FilterSelect>
        <div className="flex rounded-full border border-border bg-secondary/70 p-1">
          <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" type="button" onClick={() => setViewMode('grid')} aria-label="Grid view">
            <Grid2X2 className="size-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" type="button" onClick={() => setViewMode('list')} aria-label="List view">
            <List className="size-4" />
          </Button>
        </div>
      </section>

      {isLoading ? (
        <LoadingState label="Loading library" />
      ) : filteredSongs.length === 0 ? (
        <EmptyState title="No songs match your filters" description="Try clearing search, category, or tag filters." />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              showFavorite
              onOpen={() => navigate(`/app/songs/${song.id}`)}
              onPlay={playSong}
            />
          ))}
        </div>
      ) : (
        <SongList songs={filteredSongs} showFavorite onPlay={playSong} />
      )}
    </div>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}

function FilterSelect({ children, label, onChange, value }: FilterSelectProps) {
  return (
    <select
      className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
    >
      {children}
    </select>
  )
}
