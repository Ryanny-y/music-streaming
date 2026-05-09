import { Edit, Eye, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  DataTable,
  EmptyState,
  LoadingState,
  PageHeader,
  SearchBar,
  TagBadge,
  type DataTableColumn,
} from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { Category, Song, SongStatus } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load songs right now.'
}

export function ManageSongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [busySongIds, setBusySongIds] = useState<string[]>([])
  const navigate = useNavigate()

  const loadSongs = async () => {
    setErrorMessage('')
    const songList = await adminService.getSongs()
    setSongs(songList)
  }

  useEffect(() => {
    let isMounted = true

    Promise.all([adminService.getSongs(), adminService.getCategories()])
      .then(([songList, categoryList]) => {
        if (!isMounted) {
          return
        }

        setSongs(songList)
        setCategories(categoryList)
      })
      .catch((error) => {
        if (isMounted) {
          setSongs([])
          setErrorMessage(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredSongs = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return songs.filter((song) => {
      const matchesSearch =
        !query ||
        [song.title, song.artist, song.album, song.categoryName, ...song.tags]
          .join(' ')
          .toLowerCase()
          .includes(query)
      const matchesStatus = !statusFilter || song.status === statusFilter
      const matchesCategory = !categoryFilter || song.categoryId === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [categoryFilter, searchValue, songs, statusFilter])

  const withSongUpdate = async (songId: string, update: () => Promise<unknown>) => {
    setErrorMessage('')
    setBusySongIds((current) => [...current, songId])

    try {
      await update()
      await loadSongs()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setBusySongIds((current) => current.filter((id) => id !== songId))
    }
  }

  const updateStatus = async (song: Song) => {
    const nextStatus: SongStatus = song.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'

    await withSongUpdate(song.id, () => adminService.updateSongStatus(song.id, nextStatus))
  }

  const deleteSong = async (song: Song) => {
    if (!window.confirm(`Delete "${song.title}"?`)) {
      return
    }

    await withSongUpdate(song.id, () => adminService.deleteSong(song.id))
  }

  const columns: DataTableColumn<Song>[] = [
    {
      key: 'cover',
      header: 'Cover',
      cell: (song) => (
        <img
          className="size-12 rounded-md object-cover"
          src={song.coverImageUrl}
          alt={`${song.title} cover`}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ),
    },
    { key: 'title', header: 'Title', cell: (song) => <span className="font-medium">{song.title}</span> },
    { key: 'artist', header: 'Artist', cell: (song) => song.artist },
    { key: 'category', header: 'Category', cell: (song) => song.categoryName },
    {
      key: 'tags',
      header: 'Tags',
      cell: (song) => (
        <div className="flex flex-wrap gap-1.5">
          {song.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (song) => <Badge tone={song.status === 'PUBLISHED' ? 'success' : 'muted'}>{song.status}</Badge>,
    },
    { key: 'plays', header: 'Play count', cell: (song) => song.playCount.toLocaleString() },
    {
      key: 'actions',
      header: 'Actions',
      cell: (song) => {
        const isBusy = busySongIds.includes(song.id)

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={isBusy}
              onClick={() => navigate(`/admin/songs/${song.id}/edit`)}
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" type="button" disabled={isBusy} onClick={() => void updateStatus(song)}>
              {isBusy ? 'Updating' : song.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="ghost" size="sm" type="button" disabled={isBusy}>
              <Eye className="size-4" />
              View
            </Button>
            <Button variant="ghost" size="sm" type="button" disabled={isBusy} onClick={() => void deleteSong(song)}>
              <Trash2 className="size-4" />
              {isBusy ? 'Deleting' : 'Delete'}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalog"
        title="Songs"
        description="Manage published and unpublished songs across the platform."
        actions={
          <Button asChild>
            <Link to="/admin/songs/new">
              <Plus className="size-4" />
              Add song
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 rounded-lg border border-border bg-card/70 p-4 md:grid-cols-[1fr_12rem_14rem]">
        <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search songs" />
        <Filter value={statusFilter} onChange={setStatusFilter} label="Status">
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="UNPUBLISHED">Unpublished</option>
        </Filter>
        <Filter value={categoryFilter} onChange={setCategoryFilter} label="Category">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Filter>
      </section>

      {errorMessage ? (
        <EmptyState title="Could not load songs" description={errorMessage} />
      ) : isLoading ? (
        <LoadingState label="Loading songs" />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSongs}
          emptyMessage="No songs found"
          getRowKey={(song) => song.id}
        />
      )}
    </div>
  )
}

function Filter({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
    >
      {children}
    </select>
  )
}

function Badge({ children, tone }: { children: ReactNode; tone: 'success' | 'muted' }) {
  const className =
    tone === 'success'
      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
      : 'border-border bg-secondary text-muted-foreground'

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>
}
