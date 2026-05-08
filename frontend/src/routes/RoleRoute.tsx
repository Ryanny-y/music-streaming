import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth'
import type { ApiUserRole } from '@/types'

type RoleRouteProps = {
  allowedRole: ApiUserRole
}

export function RoleRoute({ allowedRole }: RoleRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== allowedRole) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
