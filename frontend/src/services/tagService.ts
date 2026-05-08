import { tags } from '@/mocks/musicData'
import type { Tag } from '@/types'

import { mockResolve } from './mockApi'

export async function getTags(): Promise<Tag[]> {
  return mockResolve(tags)
}

export async function getTagById(tagId: string): Promise<Tag | null> {
  const tag = tags.find((item) => item.id === tagId) ?? null

  return mockResolve(tag)
}
