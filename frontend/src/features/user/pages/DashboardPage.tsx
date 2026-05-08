import { Heart, History, Music2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader, SongCard, StatCard } from '@/components/common'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/playbackContext'
import { categoryService, songService, userService } from '@/services'
import type { Category, Song, UserDashboard } from '@/types'

export function DashboardPage() {
  const { user } = useAuth()
  const { playSong } = usePlayback()
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    Promise.all([
      userService.getUserDashboard(user.id),
      songService.getPublishedSongs(),
      categoryService.getCategories(),
    ])
      .then(([userDashboard, publishedSongs, musicCategories]) => {
        setDashboard(userDashboard)
        setSongs(publishedSongs)
        setCategories(musicCategories)
      })
      .finally(() => setIsLoading(false))
  }, [user])

  if (isLoading) {
    return <LoadingState label="Loading dashboard" />
  }

  const recommendedSongs = songs
    .filter((song) => !dashboard?.favorites.some((favorite) => favorite.id === song.id))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 4)

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Welcome back"
        title={`Hi, ${user?.fullName ?? 'listener'}`}
        description="Pick up where you left off, revisit favorites, or discover something new."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Favorite songs" value={dashboard?.favoriteCount ?? 0} icon={<Heart className="size-5" />} />
        <StatCard
          title="Recently played"
          value={dashboard?.listeningHistoryCount ?? 0}
          icon={<History className="size-5" />}
        />
        <StatCard title="Available songs" value={songs.length} icon={<Music2 className="size-5" />} />
      </section>

      <SongSection
        title="Recently Played"
        songs={dashboard?.recentlyPlayed ?? []}
        emptyTitle="No listening history yet"
        onOpen={(song) => navigate(`/app/songs/${song.id}`)}
        onPlay={playSong}
      />

      <SongSection
        title="Favorite Songs"
        songs={dashboard?.favorites ?? []}
        emptyTitle="No favorites yet"
        onOpen={(song) => navigate(`/app/songs/${song.id}`)}
        onPlay={playSong}
      />

      <SongSection
        title="Recommended Songs"
        songs={recommendedSongs}
        emptyTitle="No recommendations yet"
        onOpen={(song) => navigate(`/app/songs/${song.id}`)}
        onPlay={playSong}
      />

      <section className="space-y-5">
        <PageHeader title="Popular Categories" description="Browse your library by sound and mood." />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              category={category}
              key={category.id}
              onClick={() => navigate(`/app/categories/${category.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

type SongSectionProps = {
  title: string
  songs: Song[]
  emptyTitle: string
  onOpen: (song: Song) => void
  onPlay: (song: Song) => void
}

function SongSection({ emptyTitle, onOpen, onPlay, songs, title }: SongSectionProps) {
  return (
    <section className="space-y-5">
      <PageHeader title={title} />
      {songs.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} showFavorite onOpen={onOpen} onPlay={onPlay} />
          ))}
        </div>
      ) : (
        <EmptyState title={emptyTitle} description="Songs will appear here as you use the app." />
      )}
    </section>
  )
}
