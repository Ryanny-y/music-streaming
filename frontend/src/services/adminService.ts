import { categories, songs, tags } from '@/mocks/musicData'
import {
  getAdminDashboard as getBackendAdminDashboard,
  deleteSong as deleteBackendSong,
  getSongs as getBackendSongs,
  getUserById as getBackendUserById,
  getUsers as getBackendUsers,
  updateSongStatus as updateBackendSongStatus,
  updateUserRole as updateBackendUserRole,
  updateUserStatus as updateBackendUserStatus,
} from '@/features/admin/services/adminService'
import type {
  AdminDashboard,
  ApiUserRole,
  Category,
  CategoryPayload,
  Song,
  SongPayload,
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

export async function createSong(payload: SongPayload): Promise<Song> {
  const song: Song = {
    ...payload,
    id: `song-${Date.now()}`,
    playCount: 0,
  }

  songs.unshift(song)

  return mockMutate(song)
}

export async function updateSong(songId: string, payload: Partial<SongPayload>): Promise<Song> {
  const song = findSong(songId)

  Object.assign(song, payload)

  return mockMutate(song)
}

export async function deleteSong(songId: string): Promise<void> {
  return deleteBackendSong(songId)
}

export async function updateSongStatus(songId: string, status: SongStatus): Promise<Song> {
  return updateBackendSongStatus(songId, status)
}

export async function getCategories(): Promise<Category[]> {
  return mockResolve(categories)
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
  return mockResolve(tags)
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

function findSong(songId: string): Song {
  const song = songs.find((item) => item.id === songId)

  if (!song) {
    throw new Error('Song not found')
  }

  return song
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
