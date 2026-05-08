import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { DataTable, LoadingState, PageHeader, SearchBar, type DataTableColumn } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { Category } from '@/types'

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    adminService
      .getCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredCategories = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return categories.filter((category) =>
      !query || [category.name, category.description].join(' ').toLowerCase().includes(query),
    )
  }, [categories, searchValue])

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return

    await adminService.deleteCategory(category.id)
    setCategories((items) => items.filter((item) => item.id !== category.id))
  }

  const columns: DataTableColumn<Category>[] = [
    { key: 'name', header: 'Name', cell: (category) => <span className="font-medium">{category.name}</span> },
    { key: 'description', header: 'Description', cell: (category) => category.description },
    { key: 'count', header: 'Song count', cell: (category) => category.songCount },
    {
      key: 'actions',
      header: 'Actions',
      cell: (category) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" type="button" onClick={() => navigate(`/admin/categories/${category.id}/edit`)}>
            <Edit className="size-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" type="button" onClick={() => deleteCategory(category)}>
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
        title="Categories"
        description="Create, edit, and organize music categories."
        actions={
          <Button asChild>
            <Link to="/admin/categories/new">
              <Plus className="size-4" />
              Add category
            </Link>
          </Button>
        }
      />

      <section className="rounded-lg border border-border bg-card/70 p-4">
        <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search categories" />
      </section>

      {isLoading ? (
        <LoadingState label="Loading categories" />
      ) : (
        <DataTable columns={columns} data={filteredCategories} getRowKey={(category) => category.id} />
      )}
    </div>
  )
}
