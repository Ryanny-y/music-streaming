import type { RouteObject } from 'react-router-dom'

import { AppCategoriesPage, CategoryDetailsPage } from '@/features/categories'
import { AppSongDetailsPage, LyricsPage } from '@/features/songs'
import { AppTagsPage, TagDetailsPage } from '@/features/tags'

import { DashboardPage } from './pages/DashboardPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HistoryPage } from './pages/HistoryPage'
import { LibraryPage } from './pages/LibraryPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'

export const userRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <DashboardPage />,
  },
  {
    path: 'library',
    element: <LibraryPage />,
  },
  {
    path: 'songs/:songId',
    element: <AppSongDetailsPage />,
  },
  {
    path: 'songs/:songId/lyrics',
    element: <LyricsPage />,
  },
  {
    path: 'favorites',
    element: <FavoritesPage />,
  },
  {
    path: 'history',
    element: <HistoryPage />,
  },
  {
    path: 'categories',
    element: <AppCategoriesPage />,
  },
  {
    path: 'categories/:categoryId',
    element: <CategoryDetailsPage />,
  },
  {
    path: 'tags',
    element: <AppTagsPage />,
  },
  {
    path: 'tags/:tagId',
    element: <TagDetailsPage />,
  },
  {
    path: 'search',
    element: <SearchPage />,
  },
  {
    path: 'profile',
    element: <ProfilePage />,
  },
]
