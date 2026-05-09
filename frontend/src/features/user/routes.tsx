import type { RouteObject } from 'react-router-dom'

import { AppCategoriesPage, CategoryDetailsPage } from '@/features/categories'
import { AppTagsPage, TagDetailsPage } from '@/features/tags'

import { DashboardPage } from './pages/DashboardPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HistoryPage } from './pages/HistoryPage'
import { LibraryPage } from './pages/LibraryPage'
import { LyricsPage } from './pages/LyricsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { SongDetailsPage } from './pages/SongDetailsPage'

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
    element: <SongDetailsPage />,
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
