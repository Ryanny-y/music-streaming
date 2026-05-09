import { api, unwrapResponse } from '@/lib/api'
import type { Category } from '@/types'

type PageResponse<T> = {
  content?: T[]
}

type PublicCategoryResponse = {
  id?: string
  categoryId?: string
  name: string
  description?: string | null
  songCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

function normalizeCategory(category: PublicCategoryResponse): Category {
  return {
    id: category.id ?? category.categoryId ?? '',
    name: category.name,
    description: category.description ?? '',
    songCount: category.songCount ?? 0,
    createdAt: category.createdAt ?? undefined,
    updatedAt: category.updatedAt ?? undefined,
  }
}

function unwrapPage<T>(payload: PageResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.content ?? []
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<PageResponse<PublicCategoryResponse>>('/public/categories')
  const payload = unwrapResponse<PageResponse<PublicCategoryResponse>>(response)

  return unwrapPage(payload).map(normalizeCategory).filter((category) => category.id)
}

export async function getCategoryById(categoryId: string): Promise<Category | null> {
  const categories = await getCategories()

  return categories.find((category) => category.id === categoryId) ?? null
}
