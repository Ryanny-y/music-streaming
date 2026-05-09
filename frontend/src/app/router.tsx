import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { adminRoutes } from '@/features/admin'
import { publicRoutes } from '@/features/public'
import { userRoutes } from '@/features/user'
import { AdminLayout, PublicLayout, UserLayout } from '@/layouts'
import { RoleRoute } from '@/routes/RoleRoute'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: publicRoutes,
  },
  {
    path: '/app',
    element: <RoleRoute allowedRole="USER" />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...userRoutes,
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <RoleRoute allowedRole="ADMIN" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...adminRoutes,
        ],
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
