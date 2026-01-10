import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const KycPage = lazy(() => import('../../pages/settings/KycPage'))

export const Route = createFileRoute('/_authenticated/settings/kyc')({
  component: KycPage,
})
