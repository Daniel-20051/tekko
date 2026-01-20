import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const DepositPage = lazy(() => import('../../pages/wallets/DepositPage'))

export const Route = createFileRoute('/_authenticated/deposit')({
  component: DepositPage,
  validateSearch: (search: Record<string, unknown>): { currency?: string } => {
    return {
      currency: search.currency as string | undefined,
    }
  },
})
