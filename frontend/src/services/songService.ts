import { listeningHistory, songs } from '@/mocks/musicData'
import type { Song } from '@/types'

import { mockMutate, mockResolve } from './mockApi'

const isPublishedSong = (song: Song) => song.status === 'PUBLISHED'

export async function getPublishedSongs(): Promise<Song[]> {
  return mockResolve(songs.filter(isPublishedSong))
}

export async function getSongById(songId: string): Promise<Song | null> {
  const song = songs.find((item) => item.id === songId && item.status === 'PUBLISHED') ?? null

  return mockResolve(song)
}

export async function searchSongs(query: string): Promise<Song[]> {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return getPublishedSongs()
  }

  const results = songs.filter((song) => {
    const searchableText = [
      song.title,
      song.artist,
      song.album,
      song.description,
      song.categoryName,
      ...song.tags,
    ]
      .join(' ')
      .toLowerCase()

    return song.status === 'PUBLISHED' && searchableText.includes(normalizedQuery)
  })

  return mockResolve(results)
}

export async function getSongsByCategory(categoryId: string): Promise<Song[]> {
  return mockResolve(songs.filter((song) => song.status === 'PUBLISHED' && song.categoryId === categoryId))
}

export async function getSongsByTag(tagName: string): Promise<Song[]> {
  const normalizedTag = tagName.trim().toLowerCase()

  return mockResolve(
    songs.filter(
      (song) =>
        song.status === 'PUBLISHED' && song.tags.some((tag) => tag.toLowerCase() === normalizedTag),
    ),
  )
}

export async function recordSongPlay(songId: string, userId?: string): Promise<Song | null> {
  const song = songs.find((item) => item.id === songId && item.status === 'PUBLISHED')

  if (!song) {
    return mockResolve(null)
  }

  song.playCount += 1

  if (userId) {
    listeningHistory.unshift({
      id: `history-${Date.now()}`,
      userId,
      songId,
      playedAt: new Date().toISOString(),
    })
  }

  return mockMutate(song)
}
