import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader } from '@/components/common'
import { categoryService } from '@/services'
import type { Category } from '@/types'

export function AppCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .finally(() => setIsLoading(false))
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
