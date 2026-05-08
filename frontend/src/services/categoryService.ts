import { categories } from '@/mocks/musicData'
import type { Category } from '@/types'

import { mockResolve } from './mockApi'

export async function getCategories(): Promise<Category[]> {
  return mockResolve(categories)
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const category = categories.find((item) => item.id === categoryId) ?? null

  return mockResolve(category)
}
