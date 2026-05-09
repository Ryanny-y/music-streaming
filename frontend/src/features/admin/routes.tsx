import type { RouteObject } from 'react-router-dom'

import { AdminCategoriesPage, EditCategoryPage, NewCategoryPage } from '@/features/categories'
import { AdminSongsPage, EditSongPage, NewSongPage } from '@/features/songs'
import { AdminTagsPage, EditTagPage, NewTagPage } from '@/features/tags'

import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { ManageUsersPage } from './pages/ManageUsersPage'

export const adminRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: 'users',
    element: <ManageUsersPage />,
  },
  {
    path: 'songs',
    element: <AdminSongsPage />,
  },
  {
    path: 'songs/new',
    element: <NewSongPage />,
  },
  {
    path: 'songs/:songId/edit',
    element: <EditSongPage />,
  },
  {
    path: 'categories',
    element: <AdminCategoriesPage />,
  },
  {
    path: 'categories/new',
    element: <NewCategoryPage />,
  },
  {
    path: 'categories/:categoryId/edit',
    element: <EditCategoryPage />,
  },
  {
    path: 'tags',
    element: <AdminTagsPage />,
  },
  {
    path: 'tags/new',
    element: <NewTagPage />,
  },
  {
    path: 'tags/:tagId/edit',
    element: <EditTagPage />,
  },
]
