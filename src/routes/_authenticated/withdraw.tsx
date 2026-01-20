import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const WithdrawPage = lazy(() => import('../../pages/wallets/WithdrawPage'))

export const Route = createFileRoute('/_authenticated/withdraw')({
  component: WithdrawPage,
  validateSearch: (search: Record<string, unknown>): { currency?: string } => {
    return {
      currency: search.currency as string | undefined,
    }
  },
})
