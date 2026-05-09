import { api, unwrapResponse } from '@/lib/api'
import { resolveMediaUrl } from '@/lib/media'
import type { Favorite, ListeningHistory, Song, UpdateProfilePayload, User } from '@/types'

type PageResponse<T> = {
  content?: T[]
}

type BackendUserResponse = {
  id?: string
  userId?: string
  fullName: string
  username: string
  email: string
  role: User['role']
  isActive?: boolean
  active?: boolean
  createdAt: string
}

type BackendSongResponse = {
  id?: string
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
  status?: Song['status'] | null
  playCount?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

type BackendFavoriteResponse = {
  id: string
  song: BackendSongResponse
  createdAt: string
}

type BackendHistoryResponse = {
  id: string
  song: BackendSongResponse
  playedAt: string
}

type BackendDashboardResponse = {
  user?: BackendUserResponse
  favoriteCount?: number
  totalFavorites?: number
  listeningHistoryCount?: number
  totalListeningHistory?: number
  totalPlayedSongs?: number
  availableSongCount?: number
  recentlyPlayed?: BackendSongResponse[]
  recentlyPlayedSongs?: BackendSongResponse[]
  favorites?: BackendSongResponse[]
  favoriteSongs?: BackendSongResponse[]
  recommendedSongs?: BackendSongResponse[]
  recommendations?: BackendSongResponse[]
  latestSongs?: BackendSongResponse[]
  latest?: BackendSongResponse[]
}

export type UserDashboardData = {
  user: User
  favoriteCount: number
  listeningHistoryCount: number
  totalPlayedSongs: number
  availableSongCount: number
  recentlyPlayed: Song[]
  favorites: Song[]
  recommendedSongs: Song[]
  latestSongs: Song[]
}

export type ListeningHistoryItem = {
  id: string
  song: Song
  playedAt: string
}

function normalizeDuration(duration: BackendSongResponse['duration']): number {
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

function normalizeSong(song: BackendSongResponse): Song {
  return {
    id: song.id ?? song.songId ?? '',
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
    status: song.status ?? 'PUBLISHED',
    playCount: song.playCount ?? 0,
    createdAt: song.createdAt ?? undefined,
    updatedAt: song.updatedAt ?? undefined,
  }
}

function normalizeUser(user: BackendUserResponse): User {
  return {
    id: user.id ?? user.userId ?? '',
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive ?? user.active ?? true,
    createdAt: user.createdAt,
  }
}

export function getUserValidationMessages(error: unknown, fallbackMessage: string): string[] {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const data = error.response.data as {
      message?: string
      error?: string
      validationErrors?: Record<string, string>
    }

    if (data.validationErrors) {
      return Object.values(data.validationErrors)
    }

    return [data.message ?? data.error ?? fallbackMessage]
  }

  return [error instanceof Error ? error.message : fallbackMessage]
}

function unwrapPage<T>(payload: PageResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.content ?? []
}

function normalizeSongs(songs: BackendSongResponse[] | undefined): Song[] {
  return (songs ?? []).map(normalizeSong).filter((song) => Boolean(song.id))
}

function uniqueSongs(songs: Song[]): Song[] {
  const seen = new Set<string>()

  return songs.filter((song) => {
    if (seen.has(song.id)) {
      return false
    }

    seen.add(song.id)
    return true
  })
}

function countUniqueSongs(songs: Song[]): number {
  return uniqueSongs(songs).length
}

function getSongList(
  dashboard: BackendDashboardResponse,
  ...keys: Array<keyof BackendDashboardResponse>
): Song[] | null {
  for (const key of keys) {
    const value = dashboard[key]

    if (Array.isArray(value)) {
      return normalizeSongs(value as BackendSongResponse[])
    }
  }

  return null
}

async function getFavoriteItems(): Promise<BackendFavoriteResponse[]> {
  const response = await api.get<PageResponse<BackendFavoriteResponse>>('/users/me/favorites')
  const payload = unwrapResponse<PageResponse<BackendFavoriteResponse>>(response)

  return unwrapPage(payload)
}

async function getHistoryItems(): Promise<BackendHistoryResponse[]> {
  const response = await api.get<PageResponse<BackendHistoryResponse>>('/users/me/history')
  const payload = unwrapResponse<PageResponse<BackendHistoryResponse>>(response)

  return unwrapPage(payload)
}

async function getPublicSongs(): Promise<Song[]> {
  const response = await api.get<PageResponse<BackendSongResponse>>('/public/songs')
  const payload = unwrapResponse<PageResponse<BackendSongResponse>>(response)

  return unwrapPage(payload)
    .map(normalizeSong)
    .filter((song) => song.status === 'PUBLISHED')
}

export async function getUserDashboard(currentUser: User): Promise<UserDashboardData> {
  const response = await api.get<BackendDashboardResponse>('/users/me/dashboard')
  const dashboard = unwrapResponse<BackendDashboardResponse>(response)

  const dashboardFavorites = getSongList(dashboard, 'favorites', 'favoriteSongs')
  const dashboardRecentlyPlayed = getSongList(dashboard, 'recentlyPlayed', 'recentlyPlayedSongs')
  const dashboardRecommendations = getSongList(dashboard, 'recommendedSongs', 'recommendations')
  const dashboardLatestSongs = getSongList(dashboard, 'latestSongs', 'latest')

  const needsFavorites = dashboardFavorites === null
  const needsHistory = dashboardRecentlyPlayed === null
  const needsPublicSongs = dashboardRecommendations === null || dashboardLatestSongs === null

  const [favoriteItems, historyItems, publicSongs] = await Promise.all([
    needsFavorites ? getFavoriteItems() : Promise.resolve([]),
    needsHistory ? getHistoryItems() : Promise.resolve([]),
    needsPublicSongs ? getPublicSongs() : Promise.resolve([]),
  ])

  const favorites = dashboardFavorites ?? favoriteItems.map((favorite) => normalizeSong(favorite.song))
  const recentlyPlayed =
    dashboardRecentlyPlayed ?? historyItems.map((history) => normalizeSong(history.song)).slice(0, 4)
  const recommendedSongs =
    dashboardRecommendations ??
    publicSongs
      .filter((song) => !favorites.some((favorite) => favorite.id === song.id))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 4)
  const latestSongs =
    dashboardLatestSongs ??
    [...publicSongs]
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? b.releaseDate).getTime() -
          new Date(a.createdAt ?? a.releaseDate).getTime(),
      )
      .slice(0, 4)
  const availableSongCount =
    dashboard.availableSongCount ??
    (publicSongs.length || countUniqueSongs([...favorites, ...recentlyPlayed, ...recommendedSongs, ...latestSongs]))

  return {
    user: dashboard.user ? normalizeUser(dashboard.user) : currentUser,
    favoriteCount: dashboard.favoriteCount ?? dashboard.totalFavorites ?? favorites.length,
    listeningHistoryCount: dashboard.listeningHistoryCount ?? dashboard.totalListeningHistory ?? historyItems.length,
    totalPlayedSongs: dashboard.totalPlayedSongs ?? recentlyPlayed.length,
    availableSongCount,
    recentlyPlayed: uniqueSongs(recentlyPlayed),
    favorites: uniqueSongs(favorites),
    recommendedSongs: uniqueSongs(recommendedSongs),
    latestSongs: uniqueSongs(latestSongs),
  }
}

export async function getFavorites(_userId: string): Promise<Song[]> {
  const favorites = await getFavoriteItems()

  return favorites.map((favorite) => normalizeSong(favorite.song))
}

export async function addFavorite(_userId: string, songId: string): Promise<Favorite> {
  const response = await api.post<BackendFavoriteResponse>(`/users/me/favorites/${songId}`)
  const favorite = unwrapResponse<BackendFavoriteResponse>(response)

  return {
    id: favorite.id,
    userId: _userId,
    songId: favorite.song.id ?? favorite.song.songId ?? songId,
    createdAt: favorite.createdAt,
  }
}

export async function removeFavorite(_userId: string, songId: string): Promise<void> {
  await api.delete(`/users/me/favorites/${songId}`)
}

export async function getListeningHistory(userId: string): Promise<ListeningHistory[]> {
  const history = await getHistoryItems()

  return history.map((item) => ({
    id: item.id,
    userId,
    songId: item.song.id ?? item.song.songId ?? '',
    playedAt: item.playedAt,
  }))
}

export async function getListeningHistoryItems(): Promise<ListeningHistoryItem[]> {
  const history = await getHistoryItems()

  return history
    .map((item) => ({
      id: item.id,
      song: normalizeSong(item.song),
      playedAt: item.playedAt,
    }))
    .filter((item) => item.song.id)
}

export async function getProfile(): Promise<User> {
  const response = await api.get<BackendUserResponse>('/users/me')
  const user = unwrapResponse<BackendUserResponse>(response)

  return normalizeUser(user)
}

export async function updateProfile(_userId: string, payload: UpdateProfilePayload): Promise<User> {
  const response = await api.put<BackendUserResponse>('/users/me', payload)
  const user = unwrapResponse<BackendUserResponse>(response)

  return normalizeUser(user)
}
