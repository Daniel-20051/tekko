import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const CreateAccount = lazy(() => import('../../pages/authentication/createAccount/CreateAccount'))

export const Route = createFileRoute('/_auth/create-account')({
  component: () => (
    <div>
      <CreateAccount />
    </div>
  ),
})
