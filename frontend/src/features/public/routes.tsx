import type { RouteObject } from 'react-router-dom'

import { LoginPage, RegisterPage } from '@/features/auth'
import { CategoriesPage } from '@/features/categories'
import { SongDetailsPage } from '@/features/songs'
import { TagsPage } from '@/features/tags'

import { BrowseSongsPage } from './pages/BrowseSongsPage'
import { HomePage } from './pages/HomePage'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/songs',
    element: <BrowseSongsPage />,
  },
  {
    path: '/songs/:songId',
    element: <SongDetailsPage />,
  },
  {
    path: '/categories',
    element: <CategoriesPage />,
  },
  {
    path: '/tags',
    element: <TagsPage />,
  },
]
