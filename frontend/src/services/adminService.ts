import { categories, favorites, listeningHistory, songs, tags, users } from '@/mocks/musicData'
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
  const publishedSongs = songs.filter((song) => song.status === 'PUBLISHED').length

  return mockResolve({
    totalSongs: songs.length,
    publishedSongs,
    unpublishedSongs: songs.length - publishedSongs,
    totalUsers: users.length,
    activeUsers: users.filter((user) => user.isActive).length,
    totalCategories: categories.length,
    totalTags: tags.length,
    totalPlays: songs.reduce((total, song) => total + song.playCount, 0),
  })
}

export async function getUsers(): Promise<User[]> {
  return mockResolve(users)
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<User> {
  const user = findUser(userId)
  user.isActive = isActive

  return mockMutate(user)
}

export async function updateUserRole(userId: string, role: ApiUserRole): Promise<User> {
  const user = findUser(userId)
  user.role = role

  return mockMutate(user)
}

export async function getSongs(): Promise<Song[]> {
  return mockResolve(songs)
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
  removeById(songs, songId)
  removeWhere(favorites, (favorite) => favorite.songId === songId)
  removeWhere(listeningHistory, (history) => history.songId === songId)

  return mockResolve(undefined)
}

export async function updateSongStatus(songId: string, status: SongStatus): Promise<Song> {
  const song = findSong(songId)
  song.status = status

  return mockMutate(song)
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

function findUser(userId: string): User {
  const user = users.find((item) => item.id === userId)

  if (!user) {
    throw new Error('User not found')
  }

  return user
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

function removeWhere<T>(items: T[], predicate: (item: T) => boolean): void {
  let itemIndex = items.length

  while (itemIndex > 0) {
    itemIndex -= 1

    if (predicate(items[itemIndex])) {
      items.splice(itemIndex, 1)
    }
  }
}
