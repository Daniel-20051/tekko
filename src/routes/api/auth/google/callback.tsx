import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/google/callback')({
  beforeLoad: ({ search }) => {
    // Redirect to the actual google-callback route with the same query params
    throw redirect({
      to: '/google-callback',
      search: search as Record<string, string>,
    })
  },
})
