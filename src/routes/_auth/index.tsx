import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const Login = lazy(() => import('../../pages/authentication/login/Login'))

export const Route = createFileRoute('/_auth/')({
  component: Login,
  validateSearch: (search: Record<string, unknown>): { email?: string; linkGoogle?: string; redirect?: string } => {
    return {
      email: search.email as string | undefined,
      linkGoogle: search.linkGoogle as string | undefined,
      redirect: search.redirect as string | undefined,
    }
  },
})