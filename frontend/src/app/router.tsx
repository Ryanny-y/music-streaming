import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { adminRoutes } from '@/features/admin'
import { publicRoutes } from '@/features/public'
import { userRoutes } from '@/features/user'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'

const router = createBrowserRouter([
  ...publicRoutes,
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: userRoutes,
  },
  {
    path: '/admin',
    element: <RoleRoute allowedRole="admin" />,
    children: adminRoutes,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
