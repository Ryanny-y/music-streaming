import { FolderOpen, LayoutDashboard, ListMusic, LogOut, ShieldCheck, Tags, Users } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const adminLinks = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Songs', to: '/admin/songs', icon: ListMusic },
  { label: 'Categories', to: '/admin/categories', icon: FolderOpen },
  { label: 'Tags', to: '/admin/tags', icon: Tags },
]

export function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-background/90 p-4 backdrop-blur lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-2 py-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold">{APP_NAME} Admin</p>
              <p className="text-xs text-muted-foreground">Control room</p>
            </div>
          </div>

          <nav className="mt-8 grid gap-1">
            {adminLinks.map((link) => {
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
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Admin</p>
              <p className="text-sm text-muted-foreground">{user?.fullName}</p>
            </div>
            <Button variant="secondary" size="sm" type="button" onClick={handleLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </Button>
          </div>
        </header>

        <div className="border-b border-border bg-background/90 px-2 py-2 lg:hidden">
          <nav className="flex gap-1 overflow-x-auto">
            {adminLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'shrink-0 rounded-full px-4 py-2 text-sm text-muted-foreground',
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
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
