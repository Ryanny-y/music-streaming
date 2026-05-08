import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { adminRoutes } from '@/features/admin'
import { publicRoutes } from '@/features/public'
import { userRoutes } from '@/features/user'
import { AdminLayout, PublicLayout, UserLayout } from '@/layouts'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: publicRoutes,
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <UserLayout />,
        children: userRoutes,
      },
    ],
  },
  {
    path: '/admin',
    element: <RoleRoute allowedRole="ADMIN" />,
    children: [
      {
        element: <AdminLayout />,
        children: adminRoutes,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
