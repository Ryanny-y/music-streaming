import type { RouteObject } from 'react-router-dom'

import { EditCategoryPage, NewCategoryPage } from '@/features/categories'
import { EditSongPage, NewSongPage } from '@/features/songs'
import { AdminTagsPage, EditTagPage, NewTagPage } from '@/features/tags'

import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { ManageCategoriesPage } from './pages/ManageCategoriesPage'
import { ManageSongsPage } from './pages/ManageSongsPage'
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
    element: <ManageSongsPage />,
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
    element: <ManageCategoriesPage />,
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
