import { createFileRoute } from '@tanstack/react-router'
import CreateAccount from '../../pages/authentication/create-account/CreateAccount'

export const Route = createFileRoute('/_auth/create-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <CreateAccount/>
  </div>
}
