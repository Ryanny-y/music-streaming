export type UserRole = 'user' | 'admin'

export type RouteSection = 'public' | 'user' | 'admin'

export type ApiUserRole = 'USER' | 'ADMIN'

export type SongStatus = 'PUBLISHED' | 'UNPUBLISHED'

export type Song = {
  id: string
  title: string
  artist: string
  album: string
  description: string
  lyrics: string
  audioUrl: string
  coverImageUrl: string
  duration: number
  releaseDate: string
  categoryId: string
  categoryName: string
  tags: string[]
  status: SongStatus
  playCount: number
}

export type User = {
  id: string
  fullName: string
  username: string
  email: string
  role: ApiUserRole
  isActive: boolean
  createdAt: string
}

export type Category = {
  id: string
  name: string
  description: string
  songCount: number
}

export type Tag = {
  id: string
  name: string
  songCount: number
}

export type ListeningHistory = {
  id: string
  userId: string
  songId: string
  playedAt: string
}

export type Favorite = {
  id: string
  userId: string
  songId: string
  createdAt: string
}

export type AuthCredentials = {
  email: string
  password: string
}

export type RegisterPayload = {
  fullName: string
  username: string
  email: string
  password: string
}

export type UpdateProfilePayload = Partial<Pick<User, 'fullName' | 'username' | 'email'>>

export type SongPayload = Omit<Song, 'id' | 'playCount'>

export type CategoryPayload = Omit<Category, 'id' | 'songCount'>

export type TagPayload = Omit<Tag, 'id' | 'songCount'>

export type UserDashboard = {
  user: User
  favoriteCount: number
  listeningHistoryCount: number
  recentlyPlayed: Song[]
  favorites: Song[]
}

export type AdminDashboard = {
  totalSongs: number
  publishedSongs: number
  unpublishedSongs: number
  totalUsers: number
  activeUsers: number
  totalCategories: number
  totalTags: number
  totalPlays: number
}
