import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const ResetPassword = lazy(() => import('../../pages/authentication/resetPassword/ResetPassword'))

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
    }
  },
  component: ResetPassword,
})
