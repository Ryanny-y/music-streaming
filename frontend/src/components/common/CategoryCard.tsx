import { Library } from 'lucide-react'

import type { Category } from '@/types'

type CategoryCardProps = {
  category: Category
  onClick?: (category: Category) => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <button
      className="rounded-lg border border-border bg-card/80 p-5 text-left shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-primary/60"
      type="button"
      onClick={() => onClick?.(category)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-lg bg-primary/15 p-3 text-primary">
          <Library className="size-5" aria-hidden="true" />
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          {category.songCount} songs
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{category.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{category.description}</p>
    </button>
  )
}
