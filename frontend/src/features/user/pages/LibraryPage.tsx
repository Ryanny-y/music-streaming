import { Grid2X2, List, Play } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyState, LoadingState, PageHeader, SearchBar, SongCard } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/usePlayback'
import { categoryService, songService, tagService, userService } from '@/services'
import type { Category, Song, Tag } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load the library right now.'
}

export function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [favoriteMessage, setFavoriteMessage] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tagName, setTagName] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { user } = useAuth()
  const { playSong } = usePlayback()
  const navigate = useNavigate()

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
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setErrorMessage(getErrorMessage(error))
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!user) {
      setFavoriteSongIds([])
      return
    }

    userService
      .getFavorites(user.id)
      .then((favorites) => {
        if (isMounted) {
          setFavoriteSongIds(favorites.map((song) => song.id))
        }
      })
      .catch(() => {
        if (isMounted) {
          setFavoriteSongIds([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    let isMounted = true
    const query = searchValue.trim()

    setIsLoading(true)
    setErrorMessage(null)

    const timeoutId = window.setTimeout(() => {
      const request = query ? songService.searchSongs(query) : songService.getPublishedSongs()

      request
        .then((publishedSongs) => {
          if (!isMounted) {
            return
          }

          setSongs(publishedSongs)
        })
        .catch((error: unknown) => {
          if (!isMounted) {
            return
          }

          setSongs([])
          setErrorMessage(getErrorMessage(error))
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false)
          }
        })
    }, 250)

    return () => {
      isMounted = false
      window.clearTimeout(timeoutId)
    }
  }, [searchValue])

  const filteredSongs = useMemo(() => {
    const tag = tagName.trim().toLowerCase()

    return songs
      .filter((song) => {
        const matchesCategory = !categoryId || song.categoryId === categoryId
        const matchesTag = !tag || song.tags.some((songTag) => songTag.toLowerCase() === tag)

        return matchesCategory && matchesTag
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        if (sortBy === 'artist') return a.artist.localeCompare(b.artist)
        if (sortBy === 'most-played') return b.playCount - a.playCount
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      })
  }, [categoryId, songs, sortBy, tagName])

  const openSong = (song: Song) => {
    navigate(`/app/songs/${song.id}`)
  }

  const toggleFavorite = async (song: Song) => {
    if (!user) {
      return
    }

    setFavoriteMessage(null)

    try {
      if (favoriteSongIds.includes(song.id)) {
        await userService.removeFavorite(user.id, song.id)
        setFavoriteSongIds((current) => current.filter((songId) => songId !== song.id))
        return
      }

      await userService.addFavorite(user.id, song.id)
      setFavoriteSongIds((current) => (current.includes(song.id) ? current : [...current, song.id]))
    } catch (error: unknown) {
      setFavoriteMessage(error instanceof Error ? error.message : 'Unable to update favorite.')
    }
  }

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

      {favoriteMessage ? <p className="text-sm text-destructive">{favoriteMessage}</p> : null}

      {isLoading ? (
        <LoadingState label="Loading library" />
      ) : errorMessage ? (
        <EmptyState title="Could not load library" description={errorMessage} />
      ) : filteredSongs.length === 0 ? (
        <EmptyState title="No songs match your filters" description="Try clearing search, category, or tag filters." />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              showFavorite
              isFavorite={favoriteSongIds.includes(song.id)}
              onFavoriteToggle={toggleFavorite}
              onOpen={openSong}
              onPlay={playSong}
            />
          ))}
        </div>
      ) : (
        <LibrarySongList songs={filteredSongs} onOpen={openSong} onPlay={playSong} />
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

type LibrarySongListProps = {
  songs: Song[]
  onOpen: (song: Song) => void
  onPlay: (song: Song) => void
}

function LibrarySongList({ onOpen, onPlay, songs }: LibrarySongListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card/70">
      <div className="hidden grid-cols-[3rem_1fr_12rem_8rem] gap-4 border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-normal text-muted-foreground md:grid">
        <span />
        <span>Song</span>
        <span>Category</span>
        <span>Duration</span>
      </div>

      <div className="divide-y divide-border">
        {songs.map((song) => (
          <div
            className="grid cursor-pointer gap-4 px-4 py-3 transition hover:bg-secondary/50 md:grid-cols-[3rem_1fr_12rem_8rem] md:items-center"
            key={song.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(song)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onOpen(song)
              }
            }}
          >
            <button
              className="hidden size-10 items-center justify-center rounded-full bg-primary text-primary-foreground md:flex"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onPlay(song)
              }}
              aria-label={`Play ${song.title}`}
            >
              <Play className="size-4 fill-current" aria-hidden="true" />
            </button>

            <div className="flex min-w-0 items-center gap-3">
              <img
                className="size-12 rounded-md object-cover"
                src={song.coverImageUrl}
                alt={`${song.title} cover`}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{song.title}</p>
                <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{song.categoryName}</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{formatDuration(song.duration)}</p>
              <Button
                className="md:hidden"
                size="sm"
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onPlay(song)
                }}
              >
                <Play className="size-4 fill-current" aria-hidden="true" />
                Play
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
