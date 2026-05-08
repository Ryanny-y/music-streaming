import { favorites, listeningHistory, songs, users } from '@/mocks/musicData'
import type { Favorite, ListeningHistory, Song, UpdateProfilePayload, User, UserDashboard } from '@/types'

import { mockMutate, mockResolve } from './mockApi'

const byMostRecentHistory = (a: ListeningHistory, b: ListeningHistory) =>
  new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()

const getSongsFromIds = (songIds: string[]): Song[] =>
  songIds
    .map((songId) => songs.find((song) => song.id === songId))
    .filter((song): song is Song => Boolean(song))

export async function getUserDashboard(userId: string): Promise<UserDashboard> {
  const user = users.find((item) => item.id === userId)

  if (!user) {
    throw new Error('User not found')
  }

  const userFavorites = favorites.filter((favorite) => favorite.userId === userId)
  const userHistory = listeningHistory.filter((history) => history.userId === userId).sort(byMostRecentHistory)

  return mockResolve({
    user,
    favoriteCount: userFavorites.length,
    listeningHistoryCount: userHistory.length,
    recentlyPlayed: getSongsFromIds(userHistory.slice(0, 5).map((history) => history.songId)),
    favorites: getSongsFromIds(userFavorites.map((favorite) => favorite.songId)),
  })
}

export async function getFavorites(userId: string): Promise<Song[]> {
  const favoriteSongIds = favorites
    .filter((favorite) => favorite.userId === userId)
    .map((favorite) => favorite.songId)

  return mockResolve(getSongsFromIds(favoriteSongIds))
}

export async function addFavorite(userId: string, songId: string): Promise<Favorite> {
  const existingFavorite = favorites.find(
    (favorite) => favorite.userId === userId && favorite.songId === songId,
  )

  if (existingFavorite) {
    return mockResolve(existingFavorite)
  }

  const favorite: Favorite = {
    id: `fav-${Date.now()}`,
    userId,
    songId,
    createdAt: new Date().toISOString(),
  }

  favorites.push(favorite)

  return mockMutate(favorite)
}

export async function removeFavorite(userId: string, songId: string): Promise<void> {
  const favoriteIndex = favorites.findIndex(
    (favorite) => favorite.userId === userId && favorite.songId === songId,
  )

  if (favoriteIndex >= 0) {
    favorites.splice(favoriteIndex, 1)
  }

  return mockResolve(undefined)
}

export async function getListeningHistory(userId: string): Promise<ListeningHistory[]> {
  const history = listeningHistory.filter((item) => item.userId === userId).sort(byMostRecentHistory)

  return mockResolve(history)
}

export async function updateProfile(userId: string, payload: UpdateProfilePayload): Promise<User> {
  const user = users.find((item) => item.id === userId)

  if (!user) {
    throw new Error('User not found')
  }

  Object.assign(user, payload)

  return mockMutate(user)
}
