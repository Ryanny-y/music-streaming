import { Navigate, Outlet } from 'react-router-dom'

import { MOCK_AUTH } from '@/lib/constants'

export function ProtectedRoute() {
  if (!MOCK_AUTH.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
