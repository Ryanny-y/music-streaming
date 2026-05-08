import { Headphones } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Songs', to: '/songs' },
  { label: 'Categories', to: '/categories' },
  { label: 'Tags', to: '/tags' },
]

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3 font-semibold" to="/">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Headphones className="size-5" aria-hidden="true" />
            </span>
            <span>{APP_NAME}</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground',
                    isActive && 'bg-secondary text-foreground',
                  )
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </nav>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground',
                  isActive && 'bg-secondary text-foreground',
                )
              }
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="mx-auto min-h-[calc(100vh-9rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </div>

      <footer className="border-t border-border px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{APP_NAME} music streaming MVP</p>
          <div className="flex gap-4">
            <Link className="transition hover:text-foreground" to="/songs">
              Songs
            </Link>
            <Link className="transition hover:text-foreground" to="/login">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
