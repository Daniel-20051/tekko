import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div>
      {/* Child routes render here - they'll have their own layouts */}
      <Outlet />

      {/* Dev tools for debugging routes (only in dev mode) */}
      <TanStackRouterDevtools />
    </div>
  ),
})

