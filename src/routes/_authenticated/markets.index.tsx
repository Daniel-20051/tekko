import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const MarketsPage = lazy(() => import('../../pages/markets/MarketsPage'))

export const Route = createFileRoute('/_authenticated/markets/')({
  component: MarketsPage,
})
