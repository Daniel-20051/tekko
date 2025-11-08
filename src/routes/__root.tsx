import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

function RootComponent() {
  return (
    <div>
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

