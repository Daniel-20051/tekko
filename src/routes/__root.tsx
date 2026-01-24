import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from 'react'
import RefreshTokenLoader from '../components/ui/RefreshTokenLoader'
import Spinner from '../components/ui/Spinner'

function RootComponent() {
  return (
    <div>
      {/* Refresh token loader - shows during token refresh */}
      <RefreshTokenLoader />

      {/* Suspense boundary for lazy-loaded routes */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="xl" variant="primary" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        }
      >
        {/* Child routes render here - they'll have their own layouts */}
        <Outlet />
      </Suspense>

      {/* Dev tools for debugging routes (only in dev mode) */}
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})

