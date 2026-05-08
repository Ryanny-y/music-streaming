import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { DataTable, LoadingState, PageHeader, SearchBar, type DataTableColumn } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { Tag } from '@/types'

export function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    adminService
      .getTags()
      .then(setTags)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredTags = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return tags.filter((tag) => !query || tag.name.toLowerCase().includes(query))
  }, [searchValue, tags])

  const deleteTag = async (tag: Tag) => {
    if (!window.confirm(`Delete "${tag.name}"?`)) return

    await adminService.deleteTag(tag.id)
    setTags((items) => items.filter((item) => item.id !== tag.id))
  }

  const columns: DataTableColumn<Tag>[] = [
    { key: 'name', header: 'Name', cell: (tag) => <span className="font-medium">{tag.name}</span> },
    { key: 'count', header: 'Song count', cell: (tag) => tag.songCount },
    {
      key: 'actions',
      header: 'Actions',
      cell: (tag) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" type="button" onClick={() => navigate(`/admin/tags/${tag.id}/edit`)}>
            <Edit className="size-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" type="button" onClick={() => deleteTag(tag)}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      ),
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

      {isLoading ? <LoadingState label="Loading tags" /> : <DataTable columns={columns} data={filteredTags} getRowKey={(tag) => tag.id} />}
    </div>
  )
}
