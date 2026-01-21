import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const SwapPageComponent = lazy(() => import('../../pages/swap/SwapPage'))

export const Route = createFileRoute('/_authenticated/swap')({
  component: SwapPageComponent,
})
