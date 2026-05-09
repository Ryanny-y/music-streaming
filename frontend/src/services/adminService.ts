import {
  getAdminDashboard as getBackendAdminDashboard,
  createSong as createBackendSong,
  createCategory as createBackendCategory,
  createTag as createBackendTag,
  deleteCategory as deleteBackendCategory,
  deleteSong as deleteBackendSong,
  deleteTag as deleteBackendTag,
  getCategories as getBackendCategories,
  getCategoryById as getBackendCategoryById,
  getSongById as getBackendSongById,
  getSongs as getBackendSongs,
  getTags as getBackendTags,
  getTagById as getBackendTagById,
  getUserById as getBackendUserById,
  getUsers as getBackendUsers,
  updateSong as updateBackendSong,
  updateSongStatus as updateBackendSongStatus,
  updateCategory as updateBackendCategory,
  updateTag as updateBackendTag,
  updateUserRole as updateBackendUserRole,
  updateUserStatus as updateBackendUserStatus,
  uploadSongAudio as uploadBackendSongAudio,
  uploadSongCover as uploadBackendSongCover,
  type AdminSongPayload,
  type AdminCategoryPayload,
  type AdminTagPayload,
} from '@/features/admin/services/adminService'
import type {
  AdminDashboard,
  ApiUserRole,
  Category,
  Song,
  SongStatus,
  Tag,
  User,
} from '@/types'

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

export async function getCategoryById(categoryId: string): Promise<Category> {
  return getBackendCategoryById(categoryId)
}

export async function createCategory(payload: AdminCategoryPayload): Promise<Category> {
  return createBackendCategory(payload)
}

export async function updateCategory(categoryId: string, payload: AdminCategoryPayload): Promise<Category> {
  return updateBackendCategory(categoryId, payload)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return deleteBackendCategory(categoryId)
}

export async function getTags(): Promise<Tag[]> {
  return getBackendTags()
}

export async function getTagById(tagId: string): Promise<Tag> {
  return getBackendTagById(tagId)
}

export async function createTag(payload: AdminTagPayload): Promise<Tag> {
  return createBackendTag(payload)
}

export async function updateTag(tagId: string, payload: AdminTagPayload): Promise<Tag> {
  return updateBackendTag(tagId, payload)
}

export async function deleteTag(tagId: string): Promise<void> {
  return deleteBackendTag(tagId)
}
