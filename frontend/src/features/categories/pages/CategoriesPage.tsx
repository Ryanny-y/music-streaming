import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader } from '@/components/common'
import { categoryService } from '@/services'
import type { Category } from '@/types'

export function CategoriesPage() {
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
        eyebrow="Explore"
        title="Categories"
        description="Find songs by style and listening context across the public catalog."
      />

      {isLoading ? (
        <LoadingState label="Loading categories" />
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
