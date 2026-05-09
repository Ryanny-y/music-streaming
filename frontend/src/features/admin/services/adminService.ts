import { api, unwrapResponse } from '@/lib/api'
import type { AdminDashboard, Song } from '@/types'

type AdminSongResponse = {
  songId: string
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
    id: song.songId,
    title: song.title,
    artist: song.artist,
    album: song.album ?? '',
    description: song.description ?? '',
    lyrics: song.lyrics ?? '',
    audioUrl: song.audioUrl ?? '',
    coverImageUrl: song.coverImageUrl ?? '',
    duration: normalizeDuration(song.duration),
    releaseDate: song.releaseDate ?? '',
    categoryId: song.categoryId ?? '',
    categoryName: song.categoryName ?? '',
    tags: song.tagNames ?? [],
    status: song.status,
    playCount: song.playCount ?? 0,
    createdAt: song.createdAt ?? undefined,
    updatedAt: song.updatedAt ?? undefined,
  }
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
