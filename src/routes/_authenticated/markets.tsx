import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/markets')({
  component: MarketsLayout,
})

function MarketsLayout() {
  return <Outlet />
}
