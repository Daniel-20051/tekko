import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const PasswordReset = lazy(() => import('../../pages/authentication/passwordReset/passwordReset'))

export const Route = createFileRoute('/_auth/forgot-password')({
  component: PasswordReset,
})
