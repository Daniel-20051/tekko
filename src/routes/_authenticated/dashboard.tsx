import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const DashboardPage = lazy(() => import('../../pages/dashboard/DashboardPage'))

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})
