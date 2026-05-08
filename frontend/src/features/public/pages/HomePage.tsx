import { ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { CategoryCard, EmptyState, LoadingState, PageHeader, SongCard } from '@/components/common'
import { Button } from '@/components/ui'
import { APP_NAME } from '@/lib/constants'
import { categoryService, songService } from '@/services'
import type { Category, Song } from '@/types'

export function HomePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([songService.getPublishedSongs(), categoryService.getCategories()])
      .then(([publishedSongs, musicCategories]) => {
        setSongs(publishedSongs)
        setCategories(musicCategories)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const featuredSongs = songs.slice(0, 6)
  const recentlyAddedSongs = [...songs]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 4)

  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-lg border border-border bg-card/70 shadow-2xl shadow-black/20">
        <div className="grid min-h-[32rem] gap-8 bg-[radial-gradient(circle_at_20%_20%,hsl(346_94%_60%/.38),transparent_24rem),radial-gradient(circle_at_80%_10%,hsl(205_90%_55%/.24),transparent_22rem)] p-6 sm:p-10 lg:grid-cols-[1.05fr_.95fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Fresh tracks, smooth discovery
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              {APP_NAME}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              A dark, modern music streaming experience for discovering new songs, artists, playlists, and moods.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 px-6">
                <Link to="/login">
                  Start Listening
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild className="h-12 px-6" variant="secondary">
                <Link to="/songs">Browse Songs</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-center">
            {featuredSongs.slice(0, 4).map((song) => (
              <button
                className="group overflow-hidden rounded-lg border border-border bg-secondary text-left shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-primary/60"
                key={song.id}
                type="button"
                onClick={() => navigate(`/songs/${song.id}`)}
              >
                <div className="aspect-square bg-muted">
                  <img
                    className="size-full object-cover"
                    src={song.coverImageUrl}
                    alt={`${song.title} cover`}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-semibold">{song.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <LoadingState label="Loading featured music" />
      ) : (
        <>
          <section className="space-y-6">
            <PageHeader
              eyebrow="Featured"
              title="Featured Songs"
              description="Handpicked songs from the public catalog to get the mood started."
            />
            {featuredSongs.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredSongs.map((song) => (
                  <SongCard key={song.id} song={song} onOpen={() => navigate(`/songs/${song.id}`)} />
                ))}
              </div>
            ) : (
              <EmptyState title="No featured songs yet" description="Published songs will appear here." />
            )}
          </section>

          <section className="space-y-6">
            <PageHeader
              eyebrow="Explore"
              title="Popular Categories"
              description="Browse by sound, scene, or listening mood."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <CategoryCard
                  category={category}
                  key={category.id}
                  onClick={() => navigate(`/songs?category=${category.id}`)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <PageHeader
              eyebrow="Latest"
              title="Recently Added Songs"
              description="The newest published tracks in the catalog."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyAddedSongs.map((song) => (
                <SongCard key={song.id} song={song} onOpen={() => navigate(`/songs/${song.id}`)} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
