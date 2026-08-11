import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { SecureLayout } from '@/routes/layout'
import { ErrorPage } from '@/routes/error'
import { NotFoundPage } from '@/routes/not-found'
import MoviesPage from '@/routes/movies'
import MoviePage from '@/routes/movie'
import DownloadsPage from '@/routes/downloads'
import ScraperPage from '@/routes/scraper'

const router = createBrowserRouter([
  {
    element: <SecureLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/movies" replace /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'movies/:id', element: <MoviePage /> },
      { path: 'downloads', element: <DownloadsPage /> },
      { path: 'scraper', element: <ScraperPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
