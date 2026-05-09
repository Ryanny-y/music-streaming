import { api, unwrapResponse } from '@/lib/api'
import { resolveMediaUrl } from '@/lib/media'
import type { AdminDashboard, ApiUserRole, Category, Song, SongStatus, Tag, User } from '@/types'

export type AdminSongPayload = {
  title: string
  artist: string
  album: string
  description: string
  lyrics: string
  duration: string
  releaseDate: string
  categoryId: string
  tagIds: string[]
  status: SongStatus
}

export type AdminCategoryPayload = {
  name: string
  description: string
}

export type AdminTagPayload = {
  name: string
}

type AdminSongResponse = {
  id: string
  songId?: string
  title: string
  artist: string
  album?: string | null
  description?: string | null
  lyrics?: string | null
  audioUrl?: string | null
  coverImageUrl?: string | null
  duration?: string | number | null
  releaseDate?: string | null
  categoryId?: string | null
  categoryName?: string | null
  tags?: string[]
  tagNames?: string[]
  status: Song['status']
  playCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

type AdminDashboardResponse = Omit<AdminDashboard, 'mostPlayedSongs' | 'recentlyUploadedSongs'> & {
  mostPlayedSongs?: AdminSongResponse[]
  recentlyUploadedSongs?: AdminSongResponse[]
}

type PageResponse<T> = {
  content: T[]
}

type AdminUserResponse = {
  id: string
  userId?: string
  fullName: string
  username: string
  email: string
  role: ApiUserRole
  isActive?: boolean
  active?: boolean
  createdAt: string
  updatedAt?: string | null
}

type AdminCategoryResponse = {
  id: string
  categoryId?: string
  name: string
  description?: string | null
  songCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

type AdminTagResponse = {
  id: string
  tagId?: string
  name: string
  songCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

function normalizeDuration(duration: AdminSongResponse['duration']): number {
  if (typeof duration === 'number') {
    return duration
  }

  if (!duration) {
    return 0
  }

  const parts = duration.split(':').map(Number)

  if (parts.some(Number.isNaN)) {
    return 0
  }

  return parts.reduce((total, part) => total * 60 + part, 0)
}

function normalizeSong(song: AdminSongResponse): Song {
  return {
    id: song.id ?? song.songId,
    title: song.title,
    artist: song.artist,
    album: song.album ?? '',
    description: song.description ?? '',
    lyrics: song.lyrics ?? '',
    audioUrl: resolveMediaUrl(song.audioUrl),
    coverImageUrl: resolveMediaUrl(song.coverImageUrl),
    duration: normalizeDuration(song.duration),
    releaseDate: song.releaseDate ?? '',
    categoryId: song.categoryId ?? '',
    categoryName: song.categoryName ?? '',
    tags: song.tags ?? song.tagNames ?? [],
    status: song.status,
    playCount: song.playCount ?? 0,
    createdAt: song.createdAt ?? undefined,
    updatedAt: song.updatedAt ?? undefined,
  }
}

function normalizeUser(user: AdminUserResponse): User {
  return {
    id: user.id ?? user.userId,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive ?? user.active ?? false,
    createdAt: user.createdAt,
  }
}

function normalizeCategory(category: AdminCategoryResponse): Category {
  return {
    id: category.id ?? category.categoryId,
    name: category.name,
    description: category.description ?? '',
    songCount: category.songCount ?? 0,
    createdAt: category.createdAt ?? undefined,
    updatedAt: category.updatedAt ?? undefined,
  }
}

function normalizeTag(tag: AdminTagResponse): Tag {
  return {
    id: tag.id ?? tag.tagId,
    name: tag.name,
    songCount: tag.songCount ?? 0,
  }
}

function unwrapPage<T>(payload: PageResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.content
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const response = await api.get<AdminDashboardResponse>('/admin/dashboard')
  const dashboard = unwrapResponse<AdminDashboardResponse>(response)
  const mostPlayedSongs = dashboard.mostPlayedSongs ?? []
  const recentlyUploadedSongs = dashboard.recentlyUploadedSongs ?? []

  return {
    ...dashboard,
    mostPlayedSongs: mostPlayedSongs.map(normalizeSong),
    recentlyUploadedSongs: recentlyUploadedSongs.map(normalizeSong),
  }
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<PageResponse<AdminUserResponse>>('/admin/users')
  const payload = unwrapResponse<PageResponse<AdminUserResponse>>(response)

  return unwrapPage(payload).map(normalizeUser)
}

export async function getUserById(userId: string): Promise<User> {
  const response = await api.get<AdminUserResponse>(`/admin/users/${userId}`)
  const user = unwrapResponse<AdminUserResponse>(response)

  return normalizeUser(user)
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<User> {
  const response = await api.patch<AdminUserResponse>(`/admin/users/${userId}/status`, {
    active: isActive,
    isActive,
  })
  const user = unwrapResponse<AdminUserResponse>(response)

  return normalizeUser(user)
}

export async function updateUserRole(userId: string, role: ApiUserRole): Promise<User> {
  const response = await api.patch<AdminUserResponse>(`/admin/users/${userId}/role`, { role })
  const user = unwrapResponse<AdminUserResponse>(response)

  return normalizeUser(user)
}

export async function getSongs(): Promise<Song[]> {
  const response = await api.get<PageResponse<AdminSongResponse>>('/admin/songs')
  const payload = unwrapResponse<PageResponse<AdminSongResponse>>(response)

  return unwrapPage(payload).map(normalizeSong)
}

export async function getSongById(songId: string): Promise<Song> {
  const response = await api.get<AdminSongResponse>(`/admin/songs/${songId}`)
  const song = unwrapResponse<AdminSongResponse>(response)

  return normalizeSong(song)
}

export async function createSong(payload: AdminSongPayload): Promise<Song> {
  const response = await api.post<AdminSongResponse>('/admin/songs', payload)
  const song = unwrapResponse<AdminSongResponse>(response)

  return normalizeSong(song)
}

export async function updateSong(songId: string, payload: AdminSongPayload): Promise<Song> {
  const response = await api.put<AdminSongResponse>(`/admin/songs/${songId}`, payload)
  const song = unwrapResponse<AdminSongResponse>(response)

  return normalizeSong(song)
}

export async function deleteSong(songId: string): Promise<void> {
  await api.delete(`/admin/songs/${songId}`)
}

export async function updateSongStatus(songId: string, status: SongStatus): Promise<Song> {
  const response = await api.patch<AdminSongResponse>(`/admin/songs/${songId}/status`, { status })
  const song = unwrapResponse<AdminSongResponse>(response)

  return normalizeSong(song)
}

export async function uploadSongAudio(songId: string, file: File): Promise<Song> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<AdminSongResponse>(`/admin/songs/${songId}/audio`, formData)
  const song = unwrapResponse<AdminSongResponse>(response)

  return normalizeSong(song)
}

export async function uploadSongCover(songId: string, file: File): Promise<Song> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<AdminSongResponse>(`/admin/songs/${songId}/cover`, formData)
  const song = unwrapResponse<AdminSongResponse>(response)

  return normalizeSong(song)
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<PageResponse<AdminCategoryResponse>>('/admin/categories')
  const payload = unwrapResponse<PageResponse<AdminCategoryResponse>>(response)

  return unwrapPage(payload).map(normalizeCategory)
}

export async function getCategoryById(categoryId: string): Promise<Category> {
  const response = await api.get<AdminCategoryResponse>(`/admin/categories/${categoryId}`)
  const category = unwrapResponse<AdminCategoryResponse>(response)

  return normalizeCategory(category)
}

export async function createCategory(payload: AdminCategoryPayload): Promise<Category> {
  const response = await api.post<AdminCategoryResponse>('/admin/categories', payload)
  const category = unwrapResponse<AdminCategoryResponse>(response)

  return normalizeCategory(category)
}

export async function updateCategory(categoryId: string, payload: AdminCategoryPayload): Promise<Category> {
  const response = await api.put<AdminCategoryResponse>(`/admin/categories/${categoryId}`, payload)
  const category = unwrapResponse<AdminCategoryResponse>(response)

  return normalizeCategory(category)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await api.delete(`/admin/categories/${categoryId}`)
}

export async function getTags(): Promise<Tag[]> {
  const response = await api.get<PageResponse<AdminTagResponse>>('/admin/tags')
  const payload = unwrapResponse<PageResponse<AdminTagResponse>>(response)

  return unwrapPage(payload).map(normalizeTag)
}

export async function getTagById(tagId: string): Promise<Tag> {
  const response = await api.get<AdminTagResponse>(`/admin/tags/${tagId}`)
  const tag = unwrapResponse<AdminTagResponse>(response)

  return normalizeTag(tag)
}

export async function createTag(payload: AdminTagPayload): Promise<Tag> {
  const response = await api.post<AdminTagResponse>('/admin/tags', payload)
  const tag = unwrapResponse<AdminTagResponse>(response)

  return normalizeTag(tag)
}

export async function updateTag(tagId: string, payload: AdminTagPayload): Promise<Tag> {
  const response = await api.put<AdminTagResponse>(`/admin/tags/${tagId}`, payload)
  const tag = unwrapResponse<AdminTagResponse>(response)

  return normalizeTag(tag)
}

export async function deleteTag(tagId: string): Promise<void> {
  await api.delete(`/admin/tags/${tagId}`)
}
