import type { RouteObject } from 'react-router-dom'

import { LoginPage, RegisterPage } from '@/features/auth'

import { BrowseSongsPage } from './pages/BrowseSongsPage'
import { HomePage } from './pages/HomePage'
import { PublicCategoriesPage } from './pages/PublicCategoriesPage'
import { PublicSongDetailsPage } from './pages/PublicSongDetailsPage'
import { PublicTagsPage } from './pages/PublicTagsPage'

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
    element: <PublicSongDetailsPage />,
  },
  {
    path: '/categories',
    element: <PublicCategoriesPage />,
  },
  {
    path: '/tags',
    element: <PublicTagsPage />,
  },
]
