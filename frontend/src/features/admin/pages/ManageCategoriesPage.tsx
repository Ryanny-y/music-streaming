import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { DataTable, EmptyState, LoadingState, PageHeader, SearchBar, type DataTableColumn } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { Category } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load categories right now.'
}

export function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [deletingCategoryIds, setDeletingCategoryIds] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  const loadCategories = async () => {
    setErrorMessage('')
    const categoryList = await adminService.getCategories()
    setCategories(categoryList)
  }

  useEffect(() => {
    let isMounted = true

    adminService
      .getCategories()
      .then((categoryList) => {
        if (isMounted) {
          setCategories(categoryList)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setCategories([])
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

  const filteredCategories = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    return categories.filter((category) =>
      !query || [category.name, category.description].join(' ').toLowerCase().includes(query),
    )
  }, [categories, searchValue])

  const deleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) {
      return
    }

    setErrorMessage('')
    setDeletingCategoryIds((current) => [...current, category.id])

    try {
      await adminService.deleteCategory(category.id)
      await loadCategories()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setDeletingCategoryIds((current) => current.filter((id) => id !== category.id))
    }
  }

  const columns: DataTableColumn<Category>[] = [
    { key: 'name', header: 'Name', cell: (category) => <span className="font-medium">{category.name}</span> },
    { key: 'description', header: 'Description', cell: (category) => category.description },
    { key: 'count', header: 'Song count', cell: (category) => category.songCount },
    {
      key: 'actions',
      header: 'Actions',
      cell: (category) => {
        const isDeleting = deletingCategoryIds.includes(category.id)

        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={isDeleting}
              onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" type="button" disabled={isDeleting} onClick={() => void deleteCategory(category)}>
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

      {errorMessage ? (
        <EmptyState title="Could not load categories" description={errorMessage} />
      ) : isLoading ? (
        <LoadingState label="Loading categories" />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCategories}
          emptyMessage="No categories found"
          getRowKey={(category) => category.id}
        />
      )}
    </div>
  )
}
