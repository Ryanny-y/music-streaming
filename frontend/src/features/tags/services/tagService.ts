import { api, unwrapResponse } from '@/lib/api'
import type { Tag } from '@/types'

type PageResponse<T> = {
  content: T[]
}

type PublicTagResponse = {
  tagId: string
  name: string
  songCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

function normalizeTag(tag: PublicTagResponse): Tag {
  return {
    id: tag.tagId,
    name: tag.name,
    songCount: tag.songCount ?? 0,
  }
}

function unwrapPage<T>(payload: PageResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.content
}

export async function getTags(): Promise<Tag[]> {
  const response = await api.get<PageResponse<PublicTagResponse>>('/public/tags')
  const payload = unwrapResponse<PageResponse<PublicTagResponse>>(response)

  return unwrapPage(payload).map(normalizeTag)
}

export async function getTagById(tagId: string): Promise<Tag | null> {
  const tags = await getTags()

  return tags.find((tag) => tag.id === tagId) ?? null
}
