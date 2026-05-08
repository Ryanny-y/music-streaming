import { Navigate, Outlet } from 'react-router-dom'

import { MOCK_AUTH } from '@/lib/constants'
import type { UserRole } from '@/types'

type RoleRouteProps = {
  allowedRole: UserRole
}

export function RoleRoute({ allowedRole }: RoleRouteProps) {
  if (!MOCK_AUTH.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (MOCK_AUTH.role !== allowedRole) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
