import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const TransactionsPageComponent = lazy(() => 
  import('../../pages/transactions/TransactionsPage').then(module => ({
    default: module.default
  }))
)

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsPageComponent,
})
