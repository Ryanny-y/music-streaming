import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader } from '@/components/common'
import { categoryService } from '@/services'
import type { Category } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load categories right now.'
}

export function PublicCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    categoryService
      .getCategories()
      .then((musicCategories) => {
        if (isMounted) {
          setCategories(musicCategories)
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

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Explore"
        title="Categories"
        description="Find songs by style and listening context across the public catalog."
      />

      {isLoading ? (
        <LoadingState label="Loading categories" />
      ) : errorMessage ? (
        <EmptyState title="Could not load categories" description={errorMessage} />
      ) : categories.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              category={category}
              key={category.id}
              onClick={() => navigate(`/songs?category=${category.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No categories yet" description="Categories will appear here once they are created." />
      )}
    </div>
  )
}
