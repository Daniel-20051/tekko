import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import RefreshTokenLoader from '../components/ui/RefreshTokenLoader'

function RootComponent() {
  return (
    <div>
      {/* Refresh token loader - shows during token refresh */}
      <RefreshTokenLoader />

      {/* Child routes render here - they'll have their own layouts */}
      <Outlet />

      {/* Dev tools for debugging routes (only in dev mode) */}
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})

