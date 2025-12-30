import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const WalletsPage = lazy(() => import('../../pages/wallets/WalletsPage'))

export const Route = createFileRoute('/_authenticated/wallets')({
  component: WalletsPage,
})
