import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/google/callback')({
  beforeLoad: ({ location }) => {
    // Redirect to the actual google-callback route with the same query params
    const params = new URLSearchParams(location.search)
    throw redirect({
      to: '/google-callback',
      search: {
        code: params.get('code') || undefined,
        state: params.get('state') || undefined,
      },
    })
  },
})
