import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader } from '@/components/common'
import { categoryService } from '@/services'
import type { Category } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load categories right now.'
}

export function AppCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setErrorMessage(null)

    categoryService
      .getCategories()
      .then((categoryList) => {
        if (isMounted) {
          setCategories(categoryList)
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setCategories([])
        setErrorMessage(getErrorMessage(error))
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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Browse"
        title="Categories"
        description="Explore your listening catalog by genre and mood."
      />
      {isLoading ? (
        <LoadingState label="Loading categories" />
      ) : errorMessage ? (
        <EmptyState title="Could not load categories" description={errorMessage} />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories found" description="Categories will appear here once added." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              category={category}
              key={category.id}
              onClick={() => navigate(`/app/categories/${category.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
