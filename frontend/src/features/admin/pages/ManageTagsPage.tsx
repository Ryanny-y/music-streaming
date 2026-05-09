import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { DataTable, EmptyState, LoadingState, PageHeader, SearchBar, type DataTableColumn } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { Tag } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load tags right now.'
}

export function ManageTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingTagIds, setDeletingTagIds] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const loadTags = async () => {
    setErrorMessage('')
    const tagList = await adminService.getTags()
    setTags(tagList)
  }

  useEffect(() => {
    let isMounted = true

    adminService
      .getTags()
      .then((tagList) => {
        if (isMounted) {
          setTags(tagList)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setTags([])
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

  const filteredTags = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return tags.filter((tag) => !query || tag.name.toLowerCase().includes(query))
  }, [searchValue, tags])

  const deleteTag = async (tag: Tag) => {
    if (!window.confirm(`Delete "${tag.name}"?`)) {
      return
    }

    setErrorMessage('')
    setDeletingTagIds((current) => [...current, tag.id])

    try {
      await adminService.deleteTag(tag.id)
      await loadTags()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setDeletingTagIds((current) => current.filter((id) => id !== tag.id))
    }
  }

  const columns: DataTableColumn<Tag>[] = [
    { key: 'name', header: 'Name', cell: (tag) => <span className="font-medium">{tag.name}</span> },
    { key: 'count', header: 'Song count', cell: (tag) => tag.songCount },
    {
      key: 'actions',
      header: 'Actions',
      cell: (tag) => {
        const isDeleting = deletingTagIds.includes(tag.id)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={isDeleting}
              onClick={() => navigate(`/admin/tags/${tag.id}/edit`)}
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" type="button" disabled={isDeleting} onClick={() => void deleteTag(tag)}>
              <Trash2 className="size-4" />
              {isDeleting ? 'Deleting' : 'Delete'}
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
        title="Tags"
        description="Manage mood, context, and discovery tags."
        actions={
          <Button asChild>
            <Link to="/admin/tags/new">
              <Plus className="size-4" />
              Add tag
            </Link>
          </Button>
        }
      />

      <section className="rounded-lg border border-border bg-card/70 p-4">
        <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search tags" />
      </section>

      {errorMessage ? (
        <EmptyState title="Could not load tags" description={errorMessage} />
      ) : isLoading ? (
        <LoadingState label="Loading tags" />
      ) : (
        <DataTable columns={columns} data={filteredTags} emptyMessage="No tags found" getRowKey={(tag) => tag.id} />
      )}
    </div>
  )
}
