import {
  Clock3,
  Heart,
  LayoutDashboard,
  Library,
  ListMusic,
  LogOut,
  Tags,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { BottomPlayer, SearchBar } from '@/components/common'
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { PlaybackProvider, usePlayback } from '@/features/user/playbackContext'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Library', to: '/app/library', icon: Library },
  { label: 'Favorites', to: '/app/favorites', icon: Heart },
  { label: 'History', to: '/app/history', icon: Clock3 },
  { label: 'Categories', to: '/app/categories', icon: ListMusic },
  { label: 'Tags', to: '/app/tags', icon: Tags },
  { label: 'Profile', to: '/app/profile', icon: User },
]

export function UserLayout() {
  return (
    <PlaybackProvider>
      <UserLayoutContent />
    </PlaybackProvider>
  )
}

function UserLayoutContent() {
  const [searchValue, setSearchValue] = useState('')
  const { logout, user } = useAuth()
  const { currentSong, isPlaying, togglePlayback } = usePlayback()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-background/85 p-4 backdrop-blur md:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-2 py-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ListMusic className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">Streaming</p>
            </div>
          </div>

          <nav className="mt-8 grid gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon

              return (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground',
                      isActive && 'bg-secondary text-foreground',
                    )
                  }
                  key={link.to}
                  to={link.to}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto rounded-lg border border-border bg-card/70 p-3">
            <p className="truncate text-sm font-medium">{user?.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            <Button className="mt-3 w-full" variant="secondary" size="sm" type="button" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen pb-40 md:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center gap-4">
            <SearchBar value={searchValue} onChange={setSearchValue} className="max-w-xl" />
            <Button className="ml-auto hidden md:inline-flex" variant="secondary" size="sm" type="button" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-[4.75rem] z-40 border-t border-border bg-background/90 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {sidebarLinks.slice(0, 4).map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[0.7rem] text-muted-foreground',
                    isActive && 'bg-secondary text-foreground',
                  )
                }
                key={link.to}
                to={link.to}
              >
                <Icon className="size-4" aria-hidden="true" />
                {link.label}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <BottomPlayer song={currentSong} isPlaying={isPlaying} onPlayPause={togglePlayback} />
    </div>
  )
}
