import { Headphones, ShieldCheck } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth'
import { APP_NAME } from '@/lib/constants'
import type { ApiUserRole } from '@/types'

export function LoginPage() {
  const { isAuthenticated, isLoading, loginAsRole, user } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/app/dashboard'} replace />
  }

  const handleLogin = async (role: ApiUserRole) => {
    await loginAsRole(role)
    navigate(role === 'ADMIN' ? '/admin/dashboard' : '/app/dashboard', { replace: true })
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-6">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Headphones className="size-5 text-primary" aria-hidden="true" />
          <span>{APP_NAME}</span>
          <span>/</span>
          <span>Public</span>
        </div>

        <section className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <p className="text-sm font-medium text-primary">Mock authentication</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Login</h1>
          <p className="mt-4 text-muted-foreground">
            Choose a mock account to continue into the music streaming MVP.
          </p>

          <div className="mt-8 grid gap-3">
            <Button type="button" className="w-full" onClick={() => void handleLogin('USER')}>
              <Headphones className="size-4" aria-hidden="true" />
              Login as User
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => void handleLogin('ADMIN')}
            >
              <ShieldCheck className="size-4" aria-hidden="true" />
              Login as Admin
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
