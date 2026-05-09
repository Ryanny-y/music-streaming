import { categories, tags } from '@/mocks/musicData'
import {
  getAdminDashboard as getBackendAdminDashboard,
  createSong as createBackendSong,
  deleteSong as deleteBackendSong,
  getCategories as getBackendCategories,
  getSongById as getBackendSongById,
  getSongs as getBackendSongs,
  getTags as getBackendTags,
  getUserById as getBackendUserById,
  getUsers as getBackendUsers,
  updateSong as updateBackendSong,
  updateSongStatus as updateBackendSongStatus,
  updateUserRole as updateBackendUserRole,
  updateUserStatus as updateBackendUserStatus,
  uploadSongAudio as uploadBackendSongAudio,
  uploadSongCover as uploadBackendSongCover,
  type AdminSongPayload,
} from '@/features/admin/services/adminService'
import type {
  AdminDashboard,
  ApiUserRole,
  Category,
  CategoryPayload,
  Song,
  SongStatus,
  Tag,
  TagPayload,
  User,
} from '@/types'

import { mockMutate, mockResolve } from './mockApi'

export async function getAdminDashboard(): Promise<AdminDashboard> {
  return getBackendAdminDashboard()
}

export async function getUsers(): Promise<User[]> {
  return getBackendUsers()
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<User> {
  return updateBackendUserStatus(userId, isActive)
}

export async function updateUserRole(userId: string, role: ApiUserRole): Promise<User> {
  return updateBackendUserRole(userId, role)
}

export async function getUserById(userId: string): Promise<User> {
  return getBackendUserById(userId)
}

export async function getSongs(): Promise<Song[]> {
  return getBackendSongs()
}

export async function getSongById(songId: string): Promise<Song> {
  return getBackendSongById(songId)
}

export async function createSong(payload: AdminSongPayload): Promise<Song> {
  return createBackendSong(payload)
}

export async function updateSong(songId: string, payload: AdminSongPayload): Promise<Song> {
  return updateBackendSong(songId, payload)
}

export async function deleteSong(songId: string): Promise<void> {
  return deleteBackendSong(songId)
}

export async function updateSongStatus(songId: string, status: SongStatus): Promise<Song> {
  return updateBackendSongStatus(songId, status)
}

export async function uploadSongAudio(songId: string, file: File): Promise<Song> {
  return uploadBackendSongAudio(songId, file)
}

export async function uploadSongCover(songId: string, file: File): Promise<Song> {
  return uploadBackendSongCover(songId, file)
}

export async function getCategories(): Promise<Category[]> {
  return getBackendCategories()
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const category: Category = {
    ...payload,
    id: `cat-${Date.now()}`,
    songCount: 0,
  }

  categories.push(category)

  return mockMutate(category)
}

export async function updateCategory(categoryId: string, payload: Partial<CategoryPayload>): Promise<Category> {
  const category = findCategory(categoryId)

  Object.assign(category, payload)

  return mockMutate(category)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  removeById(categories, categoryId)

  return mockResolve(undefined)
}

export async function getTags(): Promise<Tag[]> {
  return getBackendTags()
}

export async function createTag(payload: TagPayload): Promise<Tag> {
  const tag: Tag = {
    ...payload,
    id: `tag-${Date.now()}`,
    songCount: 0,
  }

  tags.push(tag)

  return mockMutate(tag)
}

export async function updateTag(tagId: string, payload: Partial<TagPayload>): Promise<Tag> {
  const tag = findTag(tagId)

  Object.assign(tag, payload)

  return mockMutate(tag)
}

export async function deleteTag(tagId: string): Promise<void> {
  removeById(tags, tagId)

  return mockResolve(undefined)
}

function findCategory(categoryId: string): Category {
  const category = categories.find((item) => item.id === categoryId)

  if (!category) {
    throw new Error('Category not found')
  }

  return category
}

function findTag(tagId: string): Tag {
  const tag = tags.find((item) => item.id === tagId)

  if (!tag) {
    throw new Error('Tag not found')
  }

  return tag
}

function removeById<T extends { id: string }>(items: T[], id: string): void {
  const itemIndex = items.findIndex((item) => item.id === id)

  if (itemIndex >= 0) {
    items.splice(itemIndex, 1)
  }
}
