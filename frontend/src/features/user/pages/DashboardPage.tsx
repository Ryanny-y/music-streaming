import { Headphones, Heart, History, Music2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader, SongCard, StatCard } from '@/components/common'
import { useAuth } from '@/features/auth'
import { usePlayback } from '@/features/user/usePlayback'
import { categoryService, userService } from '@/services'
import type { Category, Song } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load your dashboard right now.'
}

export function DashboardPage() {
  const { user } = useAuth()
  const { playSong } = usePlayback()
  const [dashboard, setDashboard] = useState<userService.UserDashboardData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    Promise.all([userService.getUserDashboard(user), categoryService.getCategories().catch(() => [])])
      .then(([userDashboard, musicCategories]) => {
        if (!isMounted) {
          return
        }

        setDashboard(userDashboard)
        setCategories(musicCategories)
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setDashboard(null)
        setCategories([])
        setErrorMessage(getErrorMessage(error))
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user])

  if (isLoading) {
    return <LoadingState label="Loading dashboard" />
  }

  if (errorMessage || !dashboard) {
    return (
      <EmptyState
        title="Could not load dashboard"
        description={errorMessage || 'Dashboard data is unavailable.'}
      />
    )
  }

  const userName = dashboard.user.fullName || user?.fullName || 'listener'

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Welcome back"
        title={`Hi, ${userName}`}
        description="Pick up where you left off, revisit favorites, or discover something new."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Favorite songs" value={dashboard.favoriteCount} icon={<Heart className="size-5" />} />
        <StatCard title="Played songs" value={dashboard.totalPlayedSongs} icon={<Headphones className="size-5" />} />
        <StatCard
          title="History entries"
          value={dashboard.listeningHistoryCount}
          icon={<History className="size-5" />}
        />
        <StatCard title="Available songs" value={dashboard.availableSongCount} icon={<Music2 className="size-5" />} />
      </section>

      <SongSection
        title="Recently Played"
        songs={dashboard.recentlyPlayed}
        emptyTitle="No listening history yet"
        emptyDescription="Songs will appear here after you press play."
        onOpen={(song) => navigate(`/app/songs/${song.id}`)}
        onPlay={playSong}
      />

      <SongSection
        title="Favorite Songs"
        songs={dashboard.favorites}
        emptyTitle="No favorites yet"
        emptyDescription="Favorite songs from the player or library to see them here."
        onOpen={(song) => navigate(`/app/songs/${song.id}`)}
        onPlay={playSong}
      />

      <SongSection
        title="Recommended Songs"
        songs={dashboard.recommendedSongs}
        emptyTitle="No recommendations yet"
        emptyDescription="Recommendations will appear as more songs become available."
        onOpen={(song) => navigate(`/app/songs/${song.id}`)}
        onPlay={playSong}
      />

      <SongSection
        title="Latest Songs"
        songs={dashboard.latestSongs}
        emptyTitle="No latest songs yet"
        emptyDescription="Newly published songs will appear here."
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
  emptyDescription: string
  onOpen: (song: Song) => void
  onPlay: (song: Song) => void
}

function SongSection({ emptyDescription, emptyTitle, onOpen, onPlay, songs, title }: SongSectionProps) {
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
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </section>
  )
}
