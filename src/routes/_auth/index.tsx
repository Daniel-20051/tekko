import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const Login = lazy(() => import('../../pages/authentication/login/Login'))

export const Route = createFileRoute('/_auth/')({
  component: Login,
})