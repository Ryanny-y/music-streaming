import { api, unwrapResponse } from '@/lib/api'
import type { Song } from '@/types'

type PageResponse<T> = {
  content: T[]
}

type PublicSongResponse = {
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

function normalizeDuration(duration: PublicSongResponse['duration']): number {
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

function normalizeSong(song: PublicSongResponse): Song {
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

function unwrapPage<T>(payload: PageResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.content
}

export async function getPublishedSongs(): Promise<Song[]> {
  const response = await api.get<PageResponse<PublicSongResponse>>('/public/songs')
  const payload = unwrapResponse<PageResponse<PublicSongResponse>>(response)

  return unwrapPage(payload).map(normalizeSong).filter((song) => song.status === 'PUBLISHED')
}

export async function getSongById(songId: string): Promise<Song | null> {
  try {
    const response = await api.get<PublicSongResponse>(`/public/songs/${songId}`)
    const payload = unwrapResponse<PublicSongResponse>(response)
    const song = normalizeSong(payload)

    return song.status === 'PUBLISHED' ? song : null
  } catch {
    return null
  }
}

export async function searchSongs(query: string): Promise<Song[]> {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    return getPublishedSongs()
  }

  const response = await api.get<PageResponse<PublicSongResponse>>('/public/songs/search', {
    params: { query: normalizedQuery },
  })
  const payload = unwrapResponse<PageResponse<PublicSongResponse>>(response)

  return unwrapPage(payload).map(normalizeSong).filter((song) => song.status === 'PUBLISHED')
}

export async function getSongsByCategory(categoryId: string): Promise<Song[]> {
  const response = await api.get<PageResponse<PublicSongResponse>>(
    `/public/categories/${categoryId}/songs`,
  )
  const payload = unwrapResponse<PageResponse<PublicSongResponse>>(response)

  return unwrapPage(payload).map(normalizeSong).filter((song) => song.status === 'PUBLISHED')
}

export async function getSongsByTag(tagId: string): Promise<Song[]> {
  const response = await api.get<PageResponse<PublicSongResponse>>(`/public/tags/${tagId}/songs`)
  const payload = unwrapResponse<PageResponse<PublicSongResponse>>(response)

  return unwrapPage(payload).map(normalizeSong).filter((song) => song.status === 'PUBLISHED')
}

export async function recordSongPlay(songId: string, _userId?: string): Promise<Song | null> {
  await api.post(`/songs/${songId}/play`)

  return getSongById(songId)
}
