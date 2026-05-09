import type { RouteObject } from 'react-router-dom'

import { CategoriesPage } from './pages/CategoriesPage'
import { CategorySongsPage } from './pages/CategorySongsPage'
import { DashboardPage } from './pages/DashboardPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { LibraryPage } from './pages/LibraryPage'
import { ListeningHistoryPage } from './pages/ListeningHistoryPage'
import { LyricsPage } from './pages/LyricsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { SongDetailsPage } from './pages/SongDetailsPage'
import { TagsPage } from './pages/TagsPage'
import { TagSongsPage } from './pages/TagSongsPage'

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
    element: <ListeningHistoryPage />,
  },
  {
    path: 'categories',
    element: <CategoriesPage />,
  },
  {
    path: 'categories/:categoryId',
    element: <CategorySongsPage />,
  },
  {
    path: 'tags',
    element: <TagsPage />,
  },
  {
    path: 'tags/:tagId',
    element: <TagSongsPage />,
  },
  {
    path: 'search',
    element: <SearchResultsPage />,
  },
  {
    path: 'profile',
    element: <ProfilePage />,
  },
]
